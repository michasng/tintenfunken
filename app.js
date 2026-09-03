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

function fitText(element) {
  element.style.fontSize = '';
  while (element.scrollWidth > element.clientWidth && parseFloat(getComputedStyle(element).fontSize) > 8) {
    element.style.fontSize = (parseFloat(getComputedStyle(element).fontSize) - 0.5) + 'px';
  }
}

function slug(title) {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildFrontCard(card, index) {
  const template = document.getElementById('card-front-template').content.cloneNode(true);
  const root = template.querySelector('.card-front');

  root.style.setProperty('--accent', CATEGORY_COLORS[card.category] ?? '#555');
  root.querySelector('[data-field="category"]').textContent = card.category;
  root.querySelector('[data-field="id"]').textContent = String(index).padStart(2, '0');
  root.querySelector('[data-field="title"]').textContent = card.title;
  root.querySelector('[data-field="essence"]').textContent = card.essence;
  const illustration = root.querySelector('.illustration');
  const img = root.querySelector('[data-field="img"]');
  img.src = `images/${slug(card.title)}.png`;
  img.addEventListener('error', () => illustration.classList.add('no-image'), { once: true });
  return root;
}

function buildBackCard(card, titleToCardNumber, onLinkClick) {
  const template = document.getElementById('card-back-template').content.cloneNode(true);
  const root = template.querySelector('.card-back');

  root.style.setProperty('--accent', CATEGORY_COLORS[card.category] ?? '#555');
  root.querySelector('[data-field="category"]').textContent = card.category;
  root.querySelector('[data-field="title"]').textContent = card.title;
  root.querySelector('[data-field="function"]').textContent = card.function;
  root.querySelector('[data-field="application"]').textContent = card.application;
  root.querySelector('[data-field="example"]').textContent = card.example;

  if (card.pitfall?.trim()) {
    root.querySelector('[data-field="pitfall"]').textContent = card.pitfall;
  } else {
    for (const n of root.querySelectorAll('[data-optional="pitfall"]')) n.remove();
  }

  if (card.pairs_with?.trim()) {
    const tags = root.querySelector('[data-field="tags"]');
    for (const t of card.pairs_with.split(',').map(s => s.trim()).filter(Boolean)) {
      const cardNumber = titleToCardNumber?.get(t);
      const tag = document.createElement(cardNumber ? 'button' : 'span');
      tag.className = 'tag';
      tag.textContent = t;
      if (cardNumber) {
        tag.type = 'button';
        tag.addEventListener('click', event => {
          event.stopPropagation();
          onLinkClick(cardNumber);
        });
      }
      tags.append(tag);
    }
  } else {
    root.querySelector('[data-optional="pairs"]').remove();
  }

  if (card.source?.trim()) {
    const sourceElement = root.querySelector('[data-field="source"]');
    let sourceIndex = 0;
    for (const part of card.source.split(';').map(s => s.trim()).filter(Boolean)) {
      if (sourceIndex > 0) sourceElement.append(document.createElement('br'));
      sourceElement.append(part);
      sourceIndex++;
    }
  } else {
    root.querySelector('[data-optional="source"]').remove();
  }

  return root;
}

function buildPreviewCard(card, index, titleToCardNumber, onLinkClick) {
  const previewCard = document.createElement('div');
  previewCard.className = 'preview-card';

  const inner = document.createElement('div');
  inner.className = 'preview-card-inner';

  const front = document.createElement('div');
  front.className = 'preview-face preview-face-front';
  front.append(buildFrontCard(card, index));

  const back = document.createElement('div');
  back.className = 'preview-face preview-face-back';
  back.append(buildBackCard(card, titleToCardNumber, onLinkClick));

  inner.append(front, back);
  previewCard.append(inner);
  return previewCard;
}

function createPreview(cards, onCardChange) {
  const titleToCardNumber = new Map(cards.map((card, index) => [card.title, index + 1]));
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
    stage.replaceChildren(buildPreviewCard(cards[currentCard - 1], currentCard, titleToCardNumber, onCardChange));
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

function buildSheet(slots, type, label) {
  const sheet = document.createElement('div');
  sheet.className = `sheet ${type}-sheet`;
  sheet.dataset.label = label;
  for (const slot of slots) {
    const cell = document.createElement('div');
    cell.className = 'card-cell';
    if (slot) {
      cell.append(
        type === 'front'
          ? buildFrontCard(slot.data, slot.index)
          : buildBackCard(slot.data)
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

  const indexed = cards.map((data, i) => ({ data, index: i + 1 }));
  const chunks = [];
  for (let i = 0; i < indexed.length; i += 4) {
    chunks.push(indexed.slice(i, i + 4));
  }
  const n = chunks.length;

  if (duplexMode === 'auto') {
    for (let i = 0; i < n; i++) {
      container.append(
        buildSheet(padTo4(chunks[i]), 'front', `Vorderseite ${i + 1} / ${n}`),
        buildSheet(mirrorSlots(chunks[i], flipEdge), 'back', `Rückseite ${i + 1} / ${n}`)
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
        buildSheet(mirrorSlots(chunks[i], flipEdge), 'back', `Rückseite ${i + 1} / ${n}`)
      );
    }
  }

  for (const element of container.querySelectorAll('.card-title, .back-title')) {
    fitText(element);
  }
}

const baseUrl = new URL('.', location.href);
const printPath = new URL('print', baseUrl).pathname;

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

async function init() {
  const response = await fetch('cards.csv');
  const text = await response.text();
  const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });

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
  document.getElementById('showImages').addEventListener('change', event => {
    document.body.classList.toggle('hide-images', !event.target.checked);
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

init();
