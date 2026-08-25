# image_generation

Generates one PNG per card from `cards.csv` via the Forge / A1111 txt2img REST API.

## Prerequisites

- [Stable Diffusion WebUI Forge](https://github.com/lllyasviel/stable-diffusion-webui-forge) installed and a checkpoint loaded.
- Python 3.10+ (no extra packages required — stdlib only).

## 1 · Enable the API in Forge

Open `webui-user.bat` in the Forge installation folder and add `--api`:

```bat
set COMMANDLINE_ARGS=--api
```

## 2 · Start Forge

Run `run.bat` (one-click package) or `webui.bat` and wait until the UI is fully loaded.  
Verify the API is live: <http://127.0.0.1:7860/docs>

## 3 · Run the script

From the `image_generation/` directory:

```bash
# All cards
python generate.py

# Specific rows (1-based CSV row numbers)
python generate.py 1 5 10

# Override resolution and seed
python generate.py --width 1024 --height 1024 --seed 42
```

All generation parameters not passed explicitly are left to Forge's own defaults.

### Available options

| Flag | Default | Description |
|---|---|---|
| `ROW …` | all | 1-based CSV row numbers to generate |
| `--url` | `http://127.0.0.1:7860` | Forge server URL |
| `--csv` | `../cards.csv` | Path to the CSV file |
| `--wrapper` | `../wrapper_image_prompt.txt` | Wrapper prompt file |
| `--out` | `./images` | Output directory for PNGs |
| `--seed N` | Forge default (random) | Fixed seed |
| `--steps N` | Forge default | Sampling steps |
| `--cfg-scale F` | Forge default | CFG scale |
| `--sampler NAME` | Forge default | Sampler name |
| `--width PX` | Forge default | Image width |
| `--height PX` | Forge default | Image height |
| `--negative TEXT` | Forge default | Negative prompt |

## 4 · Output

Each card produces two files in `images/`:

- `{slug}.png` — generated image
- `{slug}.txt` — actual seed used + full prompt (for reproducibility)

The slug matches the filenames expected by `layout/app.js`, so images can be copied into `layout/images/` to appear in the print layout.
