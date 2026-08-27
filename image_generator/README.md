# image_generation

Generates one PNG per card from `cards.csv` via the Forge / A1111 txt2img REST API.

## Prerequisites

- [Stable Diffusion WebUI Forge](https://github.com/lllyasviel/stable-diffusion-webui-forge) installed and running.
- Python 3.10+ (no extra packages required — stdlib only).
- The following model files downloaded and placed as described in step 1.

## 1 · Download and place model files

This script is configured for **FLUX.1 [schnell] GGUF** (Apache 2.0, free for commercial use).

### Files to download

| File | Size | Source |
|---|---|---|
| `flux1-schnell-Q4_0.gguf` | ~6.8 GB | [lllyasviel/FLUX.1-schnell-gguf](https://huggingface.co/lllyasviel/FLUX.1-schnell-gguf) |
| `ae.safetensors` (VAE) | ~335 MB | [black-forest-labs/FLUX.1-schnell](https://huggingface.co/black-forest-labs/FLUX.1-schnell/tree/main) |
| `clip_l.safetensors` | ~246 MB | [lllyasviel/flux_text_encoders](https://huggingface.co/lllyasviel/flux_text_encoders/tree/main) |
| `t5xxl_fp8_e4m3fn.safetensors` | ~4.9 GB | [lllyasviel/flux_text_encoders](https://huggingface.co/lllyasviel/flux_text_encoders/tree/main) |

Use `t5xxl_fp8_e4m3fn` (not fp16) — the fp16 variant is ~9.5 GB and too large for 16 GB RAM.

### Where to place them

```
<forge-install>\
  models\
    Stable-diffusion\    ← flux1-schnell-Q4_0.gguf
    VAE\                 ← ae.safetensors
    text_encoder\        ← clip_l.safetensors
                         ← t5xxl_fp8_e4m3fn.safetensors
```

### Windows virtual memory (required)

With 16 GB RAM Forge will crash without a large page file, because the T5 encoder is offloaded to RAM during generation.

> Settings → System → Advanced system settings → Performance → Advanced → Virtual Memory  
> Set a custom size with both min and max = **40000 MB**, then restart.

## 2 · Load the model in Forge (one-time manual step)

Forge does not expose text encoder selection via its API, so this must be done once in the UI. The selection persists across restarts.

1. Launch Forge and open the **txt2img** tab.
2. **Checkpoint** dropdown → select `flux1-schnell-Q4_0.gguf`
3. **VAE / Text Encoder** box → select all three:
   - `ae.safetensors`
   - `clip_l.safetensors`
   - `t5xxl_fp8_e4m3fn.safetensors`
4. Generate one image manually to confirm everything loads correctly.

After this, the script can be run without touching the UI again.

## 4 · Enable the API in Forge

Open `webui-user.bat` in the Forge installation folder and add `--api`:

```bat
set COMMANDLINE_ARGS=--api
```

## 5 · Start Forge

Run `run.bat` (one-click package) or `webui.bat` and wait until the UI is fully loaded.  
Verify the API is live: <http://127.0.0.1:7860/docs>

## 6 · Run the script

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

## 7 · Output

Each card produces two files in `images/`:

- `{slug}.png` — generated image
- `{slug}.txt` — actual seed used + full prompt (for reproducibility)

The slug matches the filenames expected by `layout/app.js`, so images can be copied into `layout/images/` to appear in the print layout.
