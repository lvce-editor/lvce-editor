import { beforeEach, expect, jest, test } from '@jest/globals'

const getBlobUrl = jest.fn<(uri: string, type: string) => Promise<string>>()
const invoke = jest.fn<(...args: readonly any[]) => Promise<any>>()

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => ({
  getBlobUrl,
}))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke,
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

test('disposeSrc revokes blob urls in the renderer process', async () => {
  await BlobSrc.disposeSrc('blob:https://example.com/image-id')

  expect(invoke).toHaveBeenCalledWith('ObjectUrl.revoke', 'blob:https://example.com/image-id')
})

test('disposeSrc ignores non-blob urls', async () => {
  await BlobSrc.disposeSrc('/remote/workspace/image.svg')

  expect(invoke).not.toHaveBeenCalled()
})
