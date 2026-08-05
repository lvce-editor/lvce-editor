import { beforeEach, expect, jest, test } from '@jest/globals'

const getBlobUrl = jest.fn<(uri: string, type: string) => Promise<string>>()

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => ({
  getBlobUrl,
}))

const BlobSrc = await import('../src/parts/BlobSrc/BlobSrc.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('getSrc creates an SVG blob with its media type', async () => {
  getBlobUrl.mockResolvedValue('blob:https://example.com/image-id')

  await expect(BlobSrc.getSrc('memfs:///workspace/image.svg')).resolves.toBe('blob:https://example.com/image-id')
  expect(getBlobUrl).toHaveBeenCalledWith('memfs:///workspace/image.svg', 'image/svg+xml')
})
