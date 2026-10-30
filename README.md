# Tintenfunken

Print-ready deck of writing-craft cards for authors. Terminology: see [GLOSSARY.md](GLOSSARY.md).

## Development

Requires Node.js 24 and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev     # start the dev server
pnpm fix     # auto-fix lint and formatting
pnpm verify  # format check, lint, typecheck, tests, build
```

## Artworks

PNGs live in `public/artworks/`, named by card slug. The artwork generator creates one PNG per card from the Index via the Forge / A1111 txt2img API, using each card's artwork prompt.

### Setup

Requires [Stable Diffusion WebUI Forge](https://github.com/lllyasviel/stable-diffusion-webui-forge).

1. Download the models (configured for **FLUX.1 [schnell] GGUF**, Apache 2.0) and place them in `<forge-install>\models\`:

   | File                                                               | Folder             | Source                                                                                                |
   | ------------------------------------------------------------------ | ------------------ | ----------------------------------------------------------------------------------------------------- |
   | `flux1-schnell-Q4_0.gguf`                                          | `Stable-diffusion` | [lllyasviel/FLUX.1-schnell-gguf](https://huggingface.co/lllyasviel/FLUX.1-schnell-gguf)               |
   | `ae.safetensors`                                                   | `VAE`              | [black-forest-labs/FLUX.1-schnell](https://huggingface.co/black-forest-labs/FLUX.1-schnell/tree/main) |
   | `clip_l.safetensors`                                               | `text_encoder`     | [lllyasviel/flux_text_encoders](https://huggingface.co/lllyasviel/flux_text_encoders/tree/main)       |
   | `t5xxl_fp8_e4m3fn.safetensors` (not fp16, too large for 16 GB RAM) | `text_encoder`     | [lllyasviel/flux_text_encoders](https://huggingface.co/lllyasviel/flux_text_encoders/tree/main)       |

2. With 16 GB RAM on Windows, set a custom virtual memory size of 40000 MB (min and max) and restart.
3. Add `--api` to `COMMANDLINE_ARGS` in `webui-user.bat` (in the Forge install folder).
4. Start Forge once (see below), select the checkpoint and all three VAE / text encoder files in the UI, and generate one image to confirm. The selection persists.

### Run

Start Forge with `run.bat` (one-click package) or `webui.bat` in its install folder, and wait for the UI to load at `http://127.0.0.1:7860`.

```bash
pnpm generate:artworks                        # all cards
pnpm generate:artworks "Der Held" der-mentor  # specific titles or slugs
pnpm generate:artworks --seed 42
```

Each card produces `public/artworks/{slug}.png` and `public/artworks/{slug}.txt` (seed and full prompt).
