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


def build_prompt(wrapper: str, individual: str) -> str:
    collapsed = " ".join(wrapper.split())
    return collapsed.replace("[individual prompt]", individual)


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
    parser.add_argument("--url", default="http://127.0.0.1:7860", metavar="URL")
    parser.add_argument(
        "--csv",
        dest="csv_path",
        default=str(Path(__file__).parent.parent / "cards.csv"),
        metavar="PATH",
    )
    parser.add_argument(
        "--wrapper",
        default=str(Path(__file__).parent / "wrapper_image_prompt.txt"),
        metavar="PATH",
    )
    parser.add_argument(
        "--out",
        default=str(Path(__file__).parent / "images"),
        metavar="DIR",
    )
    # Optional generation parameters — only sent to the API when explicitly provided.
    parser.add_argument("--seed", type=int, metavar="N")
    parser.add_argument("--steps", type=int, metavar="N")
    parser.add_argument("--cfg-scale", type=float, dest="cfg_scale", metavar="F")
    parser.add_argument("--sampler", metavar="NAME")
    parser.add_argument("--width", type=int, metavar="PX")
    parser.add_argument("--height", type=int, metavar="PX")
    parser.add_argument(
        "--negative",
        default=str(Path(__file__).parent / "negative_image_prompt.txt"),
        metavar="PATH",
    )
    args = parser.parse_args()

    url: str = args.url
    csv_path: str = args.csv_path
    wrapper_path: str = args.wrapper
    out_dir_str: str = args.out
    row_filter: set[int] = set(args.rows) if args.rows else set()
    seed: int | None = args.seed
    steps: int | None = args.steps
    cfg_scale: float | None = args.cfg_scale
    sampler: str | None = args.sampler
    width: int | None = args.width
    height: int | None = args.height
    negative_path: str = args.negative

    wrapper_text = Path(wrapper_path).read_text(encoding="utf-8")
    negative_text = Path(negative_path).read_text(encoding="utf-8").strip()
    out_dir = Path(out_dir_str)
    out_dir.mkdir(parents=True, exist_ok=True)

    with open(csv_path, encoding="utf-8", newline="") as f:
        cards: list[dict[str, str]] = list(csv.DictReader(f))

    total = len(cards)
    targets = sorted(row_filter) if row_filter else list(range(1, total + 1))

    for row_num in targets:
        if row_num < 1 or row_num > total:
            print(f"Row {row_num} out of range (1–{total}), skipping.", file=sys.stderr)
            continue

        card = cards[row_num - 1]
        title: str = card["title"]
        full_prompt = build_prompt(wrapper_text, card["image_prompt"])

        payload: dict[str, Any] = {"prompt": full_prompt}
        if seed is not None:
            payload["seed"] = seed
        if steps is not None:
            payload["steps"] = steps
        if cfg_scale is not None:
            payload["cfg_scale"] = cfg_scale
        if sampler is not None:
            payload["sampler_name"] = sampler
        if width is not None:
            payload["width"] = width
        if height is not None:
            payload["height"] = height
        if negative_text:
            payload["negative_prompt"] = negative_text

        label = f"[{row_num}/{total}] {title}"
        print(f"{label} ...", end=" ", flush=True)

        image_b64, actual_seed = txt2img(url, payload)

        name = slug(title)
        (out_dir / f"{name}.png").write_bytes(base64.b64decode(image_b64))
        (out_dir / f"{name}.txt").write_text(
            f"seed: {actual_seed}\nprompt: {full_prompt}\n", encoding="utf-8"
        )
        print(f"done (seed {actual_seed})")


if __name__ == "__main__":
    main()
