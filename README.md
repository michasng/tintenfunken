# Tintenfunken

Print-ready deck of writing-craft cards for authors. Terminology: see [GLOSSARY.md](GLOSSARY.md).

## Run

The app uses `fetch()`, so it must be served over HTTP — opening `index.html` directly as a `file://` URL will not work.

```bash
npx serve .
```

Then open the printed URL (default: http://localhost:3000).

## Artworks

PNGs live in `artworks/`, named by card slug. Generate them with [artwork_generator](artwork_generator/README.md).
