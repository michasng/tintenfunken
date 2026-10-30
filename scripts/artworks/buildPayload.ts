import { PROMPT_SEPARATOR } from './buildPrompt'

// FLUX.1 [schnell]: CFG must be 1; higher values cause blurry output
const STEPS = 4
const CFG_SCALE = 1
const SAMPLER = 'Euler'
const SCHEDULER = 'Simple'

const NEGATIVE_PROMPT = [
  'text, letters, words, typography, signature',
  'border, frame, paper edge, margin, white background, background paper, physical print',
].join(PROMPT_SEPARATOR)

export interface Txt2ImgPayload {
  prompt: string
  steps: number
  cfg_scale: number
  sampler_name: string
  scheduler: string
  negative_prompt: string
  seed?: number
}

export const buildPayload = (prompt: string, seed?: number): Txt2ImgPayload => ({
  prompt,
  steps: STEPS,
  cfg_scale: CFG_SCALE,
  sampler_name: SAMPLER,
  scheduler: SCHEDULER,
  negative_prompt: NEGATIVE_PROMPT,
  ...(seed === undefined ? {} : { seed }),
})
