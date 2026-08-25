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

function buildBackCard(card) {
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
    root.querySelectorAll('[data-optional="pitfall"]').forEach(n => n.remove());
  }

  if (card.pairs_with?.trim()) {
    const tags = root.querySelector('[data-field="tags"]');
    card.pairs_with.split(',').map(s => s.trim()).filter(Boolean).forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      tags.append(span);
    });
  } else {
    root.querySelector('[data-optional="pairs"]').remove();
  }

  if (card.source?.trim()) {
    const sourceEl = root.querySelector('[data-field="source"]');
    card.source.split(';').map(s => s.trim()).filter(Boolean).forEach((part, i) => {
      if (i > 0) sourceEl.append(document.createElement('br'));
      sourceEl.append(part);
    });
  } else {
    root.querySelector('[data-optional="source"]').remove();
  }

  return root;
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
    return;
  }

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

async function init() {
  const response = await fetch('cards.csv');
  const text = await response.text();
  const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });

  function update() {
    render(
      data,
      document.getElementById('duplexMode').value,
      document.getElementById('flipEdge').value
    );
  }

  document.getElementById('duplexMode').addEventListener('change', update);
  document.getElementById('flipEdge').addEventListener('change', update);
  document.getElementById('showImages').addEventListener('change', e => {
    document.body.classList.toggle('hide-images', !e.target.checked);
  });
  document.getElementById('printBtn').addEventListener('click', () => window.print());

  update();
}

init();
