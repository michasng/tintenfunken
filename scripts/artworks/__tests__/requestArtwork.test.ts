import { describe, expect, it } from 'vitest'
import { ForgeError, requestArtwork } from '../requestArtwork'

const FORGE_URL = 'http://forge.test'
const PNG_BYTES = Buffer.from('png-bytes')

const jsonResponse = (body: object, status = 200) => new Response(JSON.stringify(body), { status })

describe('requestArtwork', () => {
  describe('given a successful response', () => {
    it('returns the decoded image and the seed that was used', async () => {
      const fakeFetch = async () =>
        jsonResponse({ images: [PNG_BYTES.toString('base64')], info: '{"seed": 99}' })

      const artwork = await requestArtwork(FORGE_URL, {}, fakeFetch)

      expect(artwork.png.equals(PNG_BYTES)).toBe(true)
      expect(artwork.seed).toBe(99)
    })

    it('posts the payload to the txt2img endpoint', async () => {
      const requests: { url: string; body: unknown }[] = []
      const fakeFetch = async (url: string | URL | Request, init?: RequestInit) => {
        requests.push({ url: String(url), body: init?.body })
        return jsonResponse({ images: [''], info: '{"seed": 1}' })
      }

      await requestArtwork(FORGE_URL, { prompt: 'p' }, fakeFetch)

      expect(requests).toEqual([{ url: `${FORGE_URL}/sdapi/v1/txt2img`, body: '{"prompt":"p"}' }])
    })
  })

  describe('given an error response', () => {
    it('fails with the status and message', async () => {
      const fakeFetch = async () => new Response('boom', { status: 500 })

      await expect(requestArtwork(FORGE_URL, {}, fakeFetch)).rejects.toThrow(
        new ForgeError('API error 500: boom'),
      )
    })
  })

  describe('given an unreachable server', () => {
    it('fails with a connection error', async () => {
      const fakeFetch = async () => {
        throw new Error('refused')
      }

      await expect(requestArtwork(FORGE_URL, {}, fakeFetch)).rejects.toThrow(
        'Connection error: refused',
      )
    })
  })
})
