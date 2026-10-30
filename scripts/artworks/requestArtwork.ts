export class ForgeError extends Error {}

export interface GeneratedArtwork {
  png: Buffer
  seed: number
}

interface Txt2ImgResponse {
  images: string[]
  info: string
}

const TXT2IMG_PATH = '/sdapi/v1/txt2img'

export const requestArtwork = async (
  forgeUrl: string,
  payload: object,
  fetchFn: typeof fetch = fetch,
): Promise<GeneratedArtwork> => {
  let response: Response
  try {
    response = await fetchFn(`${forgeUrl}${TXT2IMG_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    throw new ForgeError(`Connection error: ${error instanceof Error ? error.message : error}`)
  }
  if (!response.ok) {
    throw new ForgeError(`API error ${response.status}: ${await response.text()}`)
  }
  // The Forge API response is trusted to match the documented txt2img shape
  const body = (await response.json()) as Txt2ImgResponse
  const image = body.images[0]
  if (image === undefined) throw new ForgeError('API returned no image')
  return { png: Buffer.from(image, 'base64'), seed: JSON.parse(body.info).seed }
}
