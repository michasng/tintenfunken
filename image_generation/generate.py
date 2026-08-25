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

WRAPPER_PROMPT = (
    "dark literary fantasy illustration, high contrast chiaroscuro lighting, atmospheric,\n"
    "ink wash and etching style, muted palette of deep purples and warm ambers,\n"
    "no text, no letters, no words, no typography,\n"
    "continuous composition seamless to the edge"
)

NEGATIVE_PROMPT = "border, frame, paper edge, margin, white background, background paper, physical print"


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
        full_prompt = ",\n".join([card["image_prompt"], WRAPPER_PROMPT])

        payload: dict[str, Any] = {"prompt": full_prompt}
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
