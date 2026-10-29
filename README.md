# Tintenfunken

Print-ready deck of writing-craft cards. Each card's visual representation is 89 × 140 mm, four per DIN A4 sheet.

## Run

The app uses `fetch()`, so it must be served over HTTP — opening `index.html` directly as a `file://` URL will not work.

```bash
npx serve .
```

Then open the printed URL (default: http://localhost:3000).

## Add card artworks

Place one PNG per card in the `artworks/` folder. File names are derived from the card title:

- A trailing parenthetical is ignored (used for the English term, e.g. `Kontrastfigur (Foil)`)
- German umlauts are expanded: `ä → ae`, `ö → oe`, `ü → ue`, `ß → ss`
- Other diacritics are stripped
- Non-alphanumeric characters become `-`

Examples: `Der Held → der-held.png`, `Kishōtenketsu → kishotenketsu.png`, `3-Akt-Struktur → 3-akt-struktur.png`, `Kontrastfigur (Foil) → kontrastfigur.png`

Cards without a matching PNG show a dark gradient placeholder.  
Each card's artwork prompt lives in its `### Bild` section; see `artwork_generator/` for generating the artworks.

## Print

1. Open the app in a browser and choose your duplex settings in the toolbar.
2. Click **Drucken** or use Ctrl+P. Set paper size to A4, margins to none, scale to 100 %.

### Duplex settings

| Control | Options | When to use |
|---|---|---|
| **Duplex** | Manuell | Home printer without auto-duplex |
| | Automatisch | Printer with built-in duplex unit |
| **Wendeseite** | Lange Kante | Standard (portrait, flip left–right) |
| | Kurze Kante | Flip top–bottom |

**Manual duplex — step by step**

1. Print the document. The front sheets come first, backs are appended in reverse order.
2. Take the printed stack from the output tray **without flipping it**.
3. Place it back in the input tray and continue printing.

The backs are column-mirrored (or row-mirrored for short-edge) so each card aligns with its front after the physical flip.

### Cutting

Cut along the card borders on the **front** side — those are your guides.  
The backs are printed with 1.5 mm bleed, so the cut will always land on solid colour.

## Data

Each card lives in its own file in `cards/` (named after the card's slug, e.g. `cards/der-held.md`). `cards.md` is the index: it groups the cards by category and defines their order, which gives each card its number.

```markdown
- Archetyp
  - [Der Held](cards/der-held.md)
```

A card file starts with the title as `## Title`, followed by the essence and the sections `### Funktion`, `### Anwendung`, `### Beispiele`, `### Warnung`, `### Passt zu`, `### Quellen` and `### Bild`. Empty sections can be omitted. Write each paragraph on a single line; list items (`- `) are used for examples, references and sources. `Passt zu` entries (the references) link to other card files; `Bild` holds the artwork prompt as alt text: `![prompt](../artworks/slug.png)`.

Category colours are fixed in `app.js` (`CATEGORY_COLORS`). Adding a new category requires adding an entry there.
