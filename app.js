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

function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') node.className = v;
      else node.setAttribute(k, v);
    }
  }
  for (const child of children) {
    if (child == null) continue;
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

function buildFrontCard(card, index) {
  const color = CATEGORY_COLORS[card.category] ?? '#555';

  const illustration = el('div', { class: 'illustration' });
  const img = document.createElement('img');
  img.alt = '';
  img.addEventListener('error', () => illustration.classList.add('no-image'), { once: true });
  img.src = `images/${slug(card.title)}.png`;
  illustration.append(img);

  return el('div', { class: 'card card-front', style: `--accent:${color}` },
    el('div', { class: 'top-band' },
      el('span', { class: 'cat-text' }, card.category),
      el('span', { class: 'card-id' }, String(index).padStart(2, '0'))
    ),
    el('div', { class: 'title-area' },
      el('h2', { class: 'card-title' }, card.title),
      el('div', { class: 'title-rule' })
    ),
    illustration,
    el('div', { class: 'essence-area' },
      el('p', { class: 'essence-text' }, card.essence)
    )
  );
}

function buildBackCard(card) {
  const color = CATEGORY_COLORS[card.category] ?? '#555';

  const body = el('div', { class: 'back-body' },
    el('div', { class: 'field' },
      el('div', { class: 'field-label' }, 'Funktion'),
      el('p', { class: 'field-text' }, card.function)
    ),
    el('div', { class: 'rule' }),
    el('div', { class: 'field' },
      el('div', { class: 'field-label' }, 'Anwendung'),
      el('p', { class: 'field-text' }, card.application)
    ),
    el('div', { class: 'rule' }),
    el('div', { class: 'field' },
      el('div', { class: 'field-label' }, 'Beispiele'),
      el('p', { class: 'field-text examples' }, card.example)
    )
  );

  if (card.pitfall?.trim()) {
    body.append(
      el('div', { class: 'rule' }),
      el('div', { class: 'pitfall-block' },
        el('div', { class: 'pitfall-label' }, 'Fallstrick'),
        el('p', { class: 'pitfall-text' }, card.pitfall)
      )
    );
  }

  const footer = el('div', { class: 'back-footer' });

  if (card.pairs_with?.trim()) {
    const tagEls = card.pairs_with
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(t => el('span', { class: 'tag' }, t));
    footer.append(
      el('div', { class: 'pairs-row' },
        el('span', { class: 'pairs-lbl' }, 'Passt\u00A0zu'),
        el('div', { class: 'tags' }, ...tagEls)
      )
    );
  }

  if (card.source?.trim()) {
    const parts = card.source.split(';').map(s => s.trim()).filter(Boolean);
    const sourceEl = el('p', { class: 'source-text' });
    parts.forEach((part, i) => {
      if (i > 0) sourceEl.append(document.createElement('br'));
      sourceEl.append(part);
    });
    footer.append(sourceEl);
  }

  return el('div', { class: 'card card-back', style: `--accent:${color}` },
    el('div', { class: 'back-header' },
      el('div', { class: 'back-cat' }, card.category),
      el('div', { class: 'back-title' }, card.title)
    ),
    body,
    footer
  );
}

function buildSheet(slots, type, label) {
  const sheet = el('div', { class: `sheet ${type}-sheet`, 'data-label': label });
  for (const slot of slots) {
    const cell = el('div', { class: 'card-cell' });
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
