import argparse
import base64
import csv
import json
import re
import sys
import unicodedata
from pathlib import Path
from typing import Any
from urllib import error, request


def slug(title: str) -> str:
    s = title.lower()
    s = s.replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def txt2img(url: str, payload: dict[str, Any]) -> tuple[str, int]:
    data = json.dumps(payload).encode()
    req = request.Request(
        f"{url}/sdapi/v1/txt2img",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with request.urlopen(req) as resp:
            body: dict[str, Any] = json.loads(resp.read())
    except error.HTTPError as exc:
        print(f"API error {exc.code}: {exc.read().decode()}", file=sys.stderr)
        sys.exit(1)
    except error.URLError as exc:
        print(f"Connection error: {exc.reason}", file=sys.stderr)
        sys.exit(1)

    image_b64: str = body["images"][0]
    actual_seed: int = json.loads(body["info"])["seed"]
    return image_b64, actual_seed


_THIS_DIR = Path(__file__).parent

URL = "http://127.0.0.1:7860"
CSV_PATH = _THIS_DIR.parent / "cards.csv"
OUT_DIR = _THIS_DIR / "images"

# FLUX.1 [schnell] — CFG must be 1; higher values cause blurry output
STEPS = 4
CFG_SCALE = 1
SAMPLER = "Euler"
SCHEDULER = "Simple"

# Matches the category accent colours defined in the card legend (mockup.html)
CATEGORY_PALETTE: dict[str, str] = {
    "Archetyp": "muted palette of deep purples and magentas",
    "Wandlung": "muted palette of deep violets and purples",
    "Struktur": "muted palette of deep navy blues",
    "Trope": "muted palette of rich cobalt blues",
    "Konflikt": "muted palette of steel blues and ceruleans",
    "Tempo": "muted palette of teals and dark cyans",
    "Weltenbau": "muted palette of deep forest greens",
    "Atmosphäre": "muted palette of emerald greens",
    "Perspektive": "muted palette of warm ambers and oranges",
    "Szene": "muted palette of deep earthy browns and siennas",
    "Dialog": "muted palette of burnt sienna and deep oranges",
    "Thema": "muted palette of deep crimsons and dark reds",
}
DEFAULT_PALETTE = "muted palette of deep purples"

WRAPPER_PROMPT_TEMPLATE = ",\n".join(  # noqa: FLY002
    [
        "dark literary fantasy illustration, chiaroscuro lighting, atmospheric",
        "ink wash and etching style, {palette}",
        "continuous composition seamless to the edge",
    ]
)

NEGATIVE_PROMPT = ",\n".join(  # noqa: FLY002
    [
        "text, letters, words, typography, signature",
        "border, frame, paper edge, margin, white background, background paper, physical print",
    ]
)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate card images from cards.csv via the Forge / A1111 txt2img API."
    )
    parser.add_argument(
        "rows",
        nargs="*",
        type=int,
        metavar="ROW",
        help="1-based CSV row numbers to generate (omit to generate all)",
    )
    parser.add_argument("--seed", type=int, metavar="N")
    args = parser.parse_args()

    row_filter: set[int] = set(args.rows) if args.rows else set()
    seed: int | None = args.seed

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    with open(CSV_PATH, encoding="utf-8", newline="") as f:
        cards: list[dict[str, str]] = list(csv.DictReader(f))

    total = len(cards)
    targets = sorted(row_filter) if row_filter else list(range(1, total + 1))

    for row_num in targets:
        if row_num < 1 or row_num > total:
            print(f"Row {row_num} out of range (1–{total}), skipping.", file=sys.stderr)
            continue

        card = cards[row_num - 1]
        title: str = card["title"]
        palette = CATEGORY_PALETTE.get(card["category"], DEFAULT_PALETTE)
        wrapper = WRAPPER_PROMPT_TEMPLATE.format(palette=palette)
        full_prompt = ",\n".join([card["image_prompt"], wrapper])

        payload: dict[str, Any] = {
            "prompt": full_prompt,
            "steps": STEPS,
            "cfg_scale": CFG_SCALE,
            "sampler_name": SAMPLER,
            "scheduler": SCHEDULER,
        }
        if seed is not None:
            payload["seed"] = seed
        if NEGATIVE_PROMPT:
            payload["negative_prompt"] = NEGATIVE_PROMPT

        label = f"[{row_num}/{total}] {title}"
        print(f"{label} ...", end=" ", flush=True)

        image_b64, actual_seed = txt2img(URL, payload)

        name = slug(title)
        (OUT_DIR / f"{name}.png").write_bytes(base64.b64decode(image_b64))
        (OUT_DIR / f"{name}.txt").write_text(
            f"seed: {actual_seed}\nprompt: {full_prompt}\n", encoding="utf-8"
        )
        print(f"done (seed {actual_seed})")


if __name__ == "__main__":
    main()
