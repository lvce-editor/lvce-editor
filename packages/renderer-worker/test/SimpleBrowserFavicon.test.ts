import { beforeEach, expect, jest, test } from '@jest/globals'

const createObjectUrl = jest.fn<(blob: Blob) => string>()
const revokeObjectUrl = jest.fn<(url: string) => void>()

jest.unstable_mockModule('../src/parts/Url/Url.js', () => ({
  createObjectUrl,
  revokeObjectUrl,
}))

const SimpleBrowserFavicon = await import('../src/parts/SimpleBrowserFavicon/SimpleBrowserFavicon.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('creates an object url from transferred favicon bytes', async () => {
  createObjectUrl.mockReturnValue('blob:https://example.com/favicon')
  const favicon = { bytes: new Uint8Array([0, 1, 2]), mimeType: 'image/png', url: 'https://example.com/favicon.ico' }

  expect(SimpleBrowserFavicon.create(favicon)).toBe('blob:https://example.com/favicon')
  const blob = createObjectUrl.mock.calls[0][0]
  expect(blob.type).toBe('image/png')
  await expect(blob.arrayBuffer()).resolves.toEqual(new Uint8Array([0, 1, 2]).buffer)
})

test('keeps an unfetched favicon url as-is', () => {
  expect(SimpleBrowserFavicon.create('https://example.com/favicon.ico')).toBe('https://example.com/favicon.ico')
  expect(createObjectUrl).not.toHaveBeenCalled()
})

test('revokes only blob urls', () => {
  SimpleBrowserFavicon.dispose('blob:https://example.com/favicon')
  SimpleBrowserFavicon.dispose('https://example.com/favicon.ico')

  expect(revokeObjectUrl).toHaveBeenCalledTimes(1)
  expect(revokeObjectUrl).toHaveBeenCalledWith('blob:https://example.com/favicon')
})

test('gets the durable source url', () => {
  expect(SimpleBrowserFavicon.getSource({ bytes: new Uint8Array(), mimeType: 'image/png', url: 'https://example.com/favicon.ico' })).toBe(
    'https://example.com/favicon.ico',
  )
  expect(SimpleBrowserFavicon.getSource('https://example.com/favicon.ico')).toBe('https://example.com/favicon.ico')
})
