# Tintenfunken

Print-ready deck of writing-craft cards. 89 × 140 mm, four cards per DIN A4 sheet.

## Run

The app uses `fetch()`, so it must be served over HTTP — opening `index.html` directly as a `file://` URL will not work.

```bash
npx serve .
```

Then open the printed URL (default: http://localhost:3000).

## Add card images

Place one PNG per card in the `images/` folder. File names are derived from the card title:

- German umlauts are expanded: `ä → ae`, `ö → oe`, `ü → ue`, `ß → ss`
- Other diacritics are stripped
- Non-alphanumeric characters become `-`

Examples: `Der Held → der-held.png`, `Kishōtenketsu → kishotenketsu.png`, `3-Akt-Struktur → 3-akt-struktur.png`

Cards without a matching PNG show a dark gradient placeholder.  
See `image_prompts.json` for per-card illustration prompts and `wrapper_image_prompt.txt` for the shared style suffix.

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

All card content lives in `cards.csv`. Columns: `title`, `category`, `essence`, `function`, `application`, `example`, `pitfall`, `pairs_with`, `source`.

Category colours are fixed in `app.js` (`CATEGORY_COLORS`). Adding a new category requires adding an entry there.
