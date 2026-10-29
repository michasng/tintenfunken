const CATEGORY_COLORS = {
  'Archetyp':    '#8C1A6A',
  'Wandlung':    '#611b96',
  'Struktur':    '#112a75',
  'Trope':       '#2153be',
  'Konflikt':    '#4187d3',
  'Tempo':       '#15939c',
  'Weltenbau':   '#0f5c31',
  'Atmosphäre':  '#3E9E56',
  'Perspektive': '#e18a2d',
  'Szene':       '#764b1c',
  'Dialog':      '#c25211',
  'Thema':       '#8f1111',
};

const baseUrl = new URL('.', location.href);
const printPath = new URL('print', baseUrl).pathname;

function fitText(element) {
  element.style.fontSize = '';
  while (element.scrollWidth > element.clientWidth && parseFloat(getComputedStyle(element).fontSize) > 8) {
    element.style.fontSize = (parseFloat(getComputedStyle(element).fontSize) - 0.5) + 'px';
  }
}

// A trailing parenthetical (e.g. the English term in "Kontrastfigur (Foil)") is not part of the slug.
function slug(title) {
  return title
    .replace(/\s*\([^()]*\)\s*$/, '')
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function assetUrl(path) {
  return new URL(path, baseUrl).toString();
}

const SECTION_KEYS = {
  'Funktion': 'function',
  'Anwendung': 'application',
  'Beispiele': 'examples',
  'Warnung': 'pitfall',
  'Passt zu': 'references',
  'Quellen': 'sources',
  'Bild': 'artwork_prompt',
};

function parseCardIndex(text) {
  const entries = [];
  let category = '';
  for (const line of text.split(/\r?\n/)) {
    const categoryMatch = line.match(/^- (.+)$/);
    const cardMatch = line.match(/^\s+- \[[^\]]*\]\(([^)]+)\)/);
    if (categoryMatch) {
      category = categoryMatch[1].trim();
    } else if (cardMatch) {
      entries.push({ category, path: cardMatch[1] });
    }
  }
  return entries;
}

// Each non-empty line is one entry; list markers and link/image markup are stripped.
function parseCard(text) {
  const sections = {};
  let key = null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('### ')) {
      key = SECTION_KEYS[line.slice(4).trim()] ?? null;
      if (key) sections[key] = [];
    } else if (line.startsWith('## ')) {
      sections.title = [line.slice(3).trim()];
      key = 'essence';
      sections[key] = [];
    } else if (key) {
      sections[key].push(line.replace(/^- /, '').replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1'));
    }
  }
  const joined = name => (sections[name] ?? []).join(' ');
  return {
    title: joined('title'),
    essence: joined('essence'),
    function: joined('function'),
    application: joined('application'),
    examples: joinExamples(sections.examples ?? []),
    pitfall: joined('pitfall'),
    references: sections.references ?? [],
    sources: sections.sources ?? [],
    artwork_prompt: joined('artwork_prompt'),
  };
}

// Items that contain commas themselves (outside parentheses/quotes) are separated by semicolons.
function joinExamples(items) {
  const hasComma = items.some(item => item.replace(/\([^()]*\)|»[^«]*«/g, '').includes(','));
  return items.join(hasComma ? '; ' : ', ');
}

async function loadCards() {
  const indexUrl = assetUrl('cards.md');
  const index = parseCardIndex(await (await fetch(indexUrl)).text());
  return Promise.all(index.map(async ({ category, path }) => {
    const response = await fetch(new URL(path, indexUrl));
    return { ...parseCard(await response.text()), category };
  }));
}

function buildFrontCard(card, number) {
  const template = document.getElementById('card-front-template').content.cloneNode(true);
  const root = template.querySelector('.card-front');

  root.style.setProperty('--accent', CATEGORY_COLORS[card.category] ?? '#555');
  root.querySelector('[data-field="category"]').textContent = card.category;
  root.querySelector('[data-field="number"]').textContent = String(number).padStart(2, '0');
  root.querySelector('[data-field="title"]').textContent = card.title;
  root.querySelector('[data-field="essence"]').textContent = card.essence;
  const artwork = root.querySelector('.artwork');
  const img = root.querySelector('[data-field="img"]');
  img.src = assetUrl(`artworks/${slug(card.title)}.png`);
  img.addEventListener('error', () => artwork.classList.add('no-artwork'), { once: true });
  return root;
}

function buildCardLookup(cards) {
  return new Map(cards.map((card, index) => [card.title, { number: index + 1, category: card.category }]));
}

function buildBackCard(card, cardLookup, onLinkClick) {
  const template = document.getElementById('card-back-template').content.cloneNode(true);
  const root = template.querySelector('.card-back');

  root.style.setProperty('--accent', CATEGORY_COLORS[card.category] ?? '#555');
  root.querySelector('[data-field="category"]').textContent = card.category;
  root.querySelector('[data-field="title"]').textContent = card.title;
  root.querySelector('[data-field="function"]').textContent = card.function;
  root.querySelector('[data-field="application"]').textContent = card.application;
  root.querySelector('[data-field="examples"]').textContent = card.examples;

  if (card.pitfall?.trim()) {
    root.querySelector('[data-field="pitfall"]').textContent = card.pitfall;
  } else {
    for (const n of root.querySelectorAll('[data-optional="pitfall"]')) n.remove();
  }

  if (card.references.length) {
    const referenceList = root.querySelector('[data-field="references"]');
    for (const title of card.references) {
      const linked = cardLookup?.get(title);
      const clickable = linked && onLinkClick;
      const reference = document.createElement(clickable ? 'button' : 'span');
      reference.className = 'reference';
      reference.textContent = title;
      if (linked) {
        reference.style.setProperty('--accent', CATEGORY_COLORS[linked.category] ?? '#555');
      }
      if (clickable) {
        reference.type = 'button';
        reference.addEventListener('click', event => {
          event.stopPropagation();
          onLinkClick(linked.number);
        });
      }
      referenceList.append(reference);
    }
  } else {
    root.querySelector('[data-optional="references"]').remove();
  }

  if (card.sources.length) {
    const sourcesElement = root.querySelector('[data-field="sources"]');
    for (const [sourceIndex, part] of card.sources.entries()) {
      if (sourceIndex > 0) sourcesElement.append(document.createElement('br'));
      sourcesElement.append(part);
    }
  } else {
    root.querySelector('[data-optional="sources"]').remove();
  }

  return root;
}

function buildPreviewCard(card, number, cardLookup, onLinkClick) {
  const previewCard = document.createElement('div');
  previewCard.className = 'preview-card';

  const inner = document.createElement('div');
  inner.className = 'preview-card-inner';

  const front = document.createElement('div');
  front.className = 'preview-face preview-face-front';
  front.append(buildFrontCard(card, number));

  const back = document.createElement('div');
  back.className = 'preview-face preview-face-back';
  back.append(buildBackCard(card, cardLookup, onLinkClick));

  inner.append(front, back);
  previewCard.append(inner);
  return previewCard;
}

function createPreview(cards, onCardChange) {
  const cardLookup = buildCardLookup(cards);
  const stage = document.querySelector('.preview-stage');
  const counter = document.querySelector('.preview-counter');
  const previousButton = document.querySelector('.preview-previous');
  const nextButton = document.querySelector('.preview-next');
  const searchInput = document.querySelector('.preview-search-input');
  const suggestionList = document.querySelector('.preview-suggestions');
  const maximumSuggestions = 8;
  let currentCard = 1;
  let matches = [];
  let activeSuggestion = -1;

  function show(cardNumber) {
    currentCard = Math.min(Math.max(cardNumber, 1), cards.length);
    stage.replaceChildren(buildPreviewCard(cards[currentCard - 1], currentCard, cardLookup, onCardChange));
    counter.textContent = `${currentCard} / ${cards.length}`;
    previousButton.disabled = currentCard === 1;
    nextButton.disabled = currentCard === cards.length;
    for (const element of stage.querySelectorAll('.card-title, .back-title')) {
      fitText(element);
    }
  }

  function closeSuggestions() {
    suggestionList.replaceChildren();
    suggestionList.hidden = true;
    matches = [];
    activeSuggestion = -1;
  }

  function selectSuggestion(cardNumber) {
    searchInput.value = '';
    closeSuggestions();
    onCardChange(cardNumber);
  }

  function highlightSuggestion(index) {
    activeSuggestion = index;
    for (const [position, item] of [...suggestionList.children].entries()) {
      item.classList.toggle('active', position === activeSuggestion);
    }
  }

  function updateSuggestions() {
    const term = searchInput.value.trim().toLowerCase();
    matches = term
      ? cards
          .map((card, index) => ({ title: card.title, cardNumber: index + 1 }))
          .filter(entry => entry.title.toLowerCase().includes(term))
          .slice(0, maximumSuggestions)
      : [];
    activeSuggestion = -1;

    if (matches.length === 0) {
      closeSuggestions();
      return;
    }

    suggestionList.replaceChildren(...matches.map(match => {
      const item = document.createElement('li');
      item.className = 'preview-suggestion';
      item.textContent = match.title;
      item.addEventListener('mousedown', event => {
        event.preventDefault();
        selectSuggestion(match.cardNumber);
      });
      return item;
    }));
    suggestionList.hidden = false;
  }

  stage.addEventListener('click', () => {
    stage.querySelector('.preview-card-inner')?.classList.toggle('flipped');
  });
  previousButton.addEventListener('click', () => onCardChange(currentCard - 1));
  nextButton.addEventListener('click', () => onCardChange(currentCard + 1));

  searchInput.addEventListener('input', updateSuggestions);
  searchInput.addEventListener('blur', closeSuggestions);
  searchInput.addEventListener('keydown', event => {
    if (matches.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      highlightSuggestion((activeSuggestion + 1) % matches.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      highlightSuggestion((activeSuggestion - 1 + matches.length) % matches.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      selectSuggestion((matches[activeSuggestion] ?? matches[0]).cardNumber);
    } else if (event.key === 'Escape') {
      closeSuggestions();
    }
  });

  return { show };
}

function buildSheet(slots, type, label, cardLookup) {
  const sheet = document.createElement('div');
  sheet.className = `sheet ${type}-sheet`;
  sheet.dataset.label = label;
  for (const slot of slots) {
    const cell = document.createElement('div');
    cell.className = 'card-cell';
    if (slot) {
      cell.append(
        type === 'front'
          ? buildFrontCard(slot.data, slot.number)
          : buildBackCard(slot.data, cardLookup)
      );
    }
    sheet.append(cell);
  }
  return sheet;
}

function padTo4(arr) {
  const out = arr.slice();
  while (out.length < 4) out.push(null);
  return out;
}

function mirrorSlots(slots, flipEdge) {
  const [a, b, c, d] = padTo4(slots);
  return flipEdge === 'long' ? [b, a, d, c] : [c, d, a, b];
}

function render(cards, duplexMode, flipEdge) {
  const container = document.getElementById('sheets');
  container.innerHTML = '';

  const cardLookup = buildCardLookup(cards);
  const numbered = cards.map((data, i) => ({ data, number: i + 1 }));
  const chunks = [];
  for (let i = 0; i < numbered.length; i += 4) {
    chunks.push(numbered.slice(i, i + 4));
  }
  const n = chunks.length;

  if (duplexMode === 'auto') {
    for (let i = 0; i < n; i++) {
      container.append(
        buildSheet(padTo4(chunks[i]), 'front', `Vorderseite ${i + 1} / ${n}`),
        buildSheet(mirrorSlots(chunks[i], flipEdge), 'back', `Rückseite ${i + 1} / ${n}`, cardLookup)
      );
    }
  } else {
    for (let i = 0; i < n; i++) {
      container.append(
        buildSheet(padTo4(chunks[i]), 'front', `Vorderseite ${i + 1} / ${n}`)
      );
    }

    const divider = document.createElement('div');
    divider.className = 'divider';
    divider.innerHTML = `
      <strong>Rückseiten einlegen</strong>
      <p>Den bedruckten Stapel (${n}&nbsp;Seite${n !== 1 ? 'n' : ''}) aus dem Ausgabefach nehmen und in den Einzug legen.</p>
      <p>Lange Kante: Stapel links–rechts wenden &nbsp;·&nbsp; Kurze Kante: Stapel oben–unten wenden</p>
    `;
    container.append(divider);

    for (let i = n - 1; i >= 0; i--) {
      container.append(
        buildSheet(mirrorSlots(chunks[i], flipEdge), 'back', `Rückseite ${i + 1} / ${n}`, cardLookup)
      );
    }
  }

  for (const element of container.querySelectorAll('.card-title, .back-title')) {
    fitText(element);
  }
}

function readRoute() {
  const path = location.pathname.replace(/\/+$/, '');
  const isPrint = path === printPath.replace(/\/+$/, '');
  const card = Number(new URLSearchParams(location.search).get('card')) || 1;
  return { mode: isPrint ? 'print' : 'preview', card: Math.max(card, 1) };
}

function routeToUrl({ mode, card }) {
  if (mode === 'print') {
    return printPath;
  }
  const url = new URL(baseUrl);
  if (card > 1) {
    url.searchParams.set('card', card);
  }
  return url.pathname + url.search;
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) {
    return;
  }

  navigator.serviceWorker.register(assetUrl('service-worker.js'), {
    scope: baseUrl.pathname,
  }).catch(error => {
    console.warn('Service worker registration failed.', error);
  });
}

async function init() {
  const data = await loadCards();

  const sheets = document.getElementById('sheets');
  const preview = document.getElementById('preview');
  const viewMode = document.getElementById('viewMode');
  const previewController = createPreview(data, card => navigate({ mode: 'preview', card }));

  function renderPrint() {
    render(
      data,
      document.getElementById('duplexMode').value,
      document.getElementById('flipEdge').value
    );
  }

  function applyRoute(route) {
    const isPreview = route.mode === 'preview';
    viewMode.value = route.mode;
    document.body.classList.toggle('preview-active', isPreview);
    preview.hidden = !isPreview;
    sheets.hidden = isPreview;
    if (isPreview) {
      previewController.show(route.card);
    } else {
      renderPrint();
    }
  }

  function navigate(route) {
    history.pushState(route, '', routeToUrl(route));
    applyRoute(route);
  }

  viewMode.addEventListener('change', () => {
    navigate({ mode: viewMode.value, card: 1 });
  });
  document.getElementById('duplexMode').addEventListener('change', renderPrint);
  document.getElementById('flipEdge').addEventListener('change', renderPrint);
  document.getElementById('showArtworks').addEventListener('change', event => {
    document.body.classList.toggle('hide-artworks', !event.target.checked);
  });
  document.getElementById('printButton').addEventListener('click', () => window.print());
  window.addEventListener('popstate', () => applyRoute(readRoute()));

  applyRoute(readRoute());
  // re-run after webfonts load; initial pass uses fallback font metrics
  await document.fonts.ready;
  for (const element of document.querySelectorAll('.card-title, .back-title')) {
    fitText(element);
  }
}

registerServiceWorker();
init();
