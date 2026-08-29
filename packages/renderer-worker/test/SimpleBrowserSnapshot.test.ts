import { beforeEach, expect, jest, test } from '@jest/globals'

const createObjectUrl = jest.fn<(blob: Blob) => string>()
const revokeObjectUrl = jest.fn<(url: string) => void>()

jest.unstable_mockModule('../src/parts/Url/Url.js', () => ({
  createObjectUrl,
  revokeObjectUrl,
}))

const SimpleBrowserSnapshot = await import('../src/parts/SimpleBrowserSnapshot/SimpleBrowserSnapshot.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('creates a png object url from captured bytes', async () => {
  const bytes = new Uint8Array([137, 80, 78, 71])
  createObjectUrl.mockReturnValue('blob:https://example.com/snapshot')

  expect(SimpleBrowserSnapshot.create(bytes)).toBe('blob:https://example.com/snapshot')
  expect(createObjectUrl).toHaveBeenCalledTimes(1)
  const blob = createObjectUrl.mock.calls[0][0]
  expect(blob.type).toBe('image/png')
  await expect(blob.arrayBuffer()).resolves.toEqual(bytes.buffer)
})

test('revokes a snapshot object url', () => {
  SimpleBrowserSnapshot.dispose('blob:https://example.com/snapshot')

  expect(revokeObjectUrl).toHaveBeenCalledWith('blob:https://example.com/snapshot')
})

test('does not revoke an empty snapshot', () => {
  SimpleBrowserSnapshot.dispose('')

  expect(revokeObjectUrl).not.toHaveBeenCalled()
})
