import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/BlobWorker/BlobWorker.js', () => ({
  invoke: jest.fn(),
}))

const BlobWorker = await import('../src/parts/BlobWorker/BlobWorker.js')
const BlobModule = await import('../src/parts/Blob/Blob.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('base64StringToBlob uses the blob worker', async () => {
  const result = new globalThis.Blob(['content'])
  jest.mocked(BlobWorker.invoke).mockResolvedValue(result)
  await expect(BlobModule.base64StringToBlob('Y29udGVudA==')).resolves.toBe(result)
  expect(BlobWorker.invoke).toHaveBeenCalledWith('Blob.base64StringToBlob', 'Y29udGVudA==')
})

test('binaryStringToBlob uses the blob worker and preserves the mime type', async () => {
  const result = new globalThis.Blob(['\x89PNG'], { type: 'image/png' })
  jest.mocked(BlobWorker.invoke).mockResolvedValue(result)
  await expect(BlobModule.binaryStringToBlob('\x89PNG', 'image/png')).resolves.toBe(result)
  expect(BlobWorker.invoke).toHaveBeenCalledWith('Blob.binaryStringToBlob', '\x89PNG', 'image/png')
})

test('blobToBinaryString uses the blob worker', async () => {
  jest.mocked(BlobWorker.invoke).mockResolvedValue('\x00\xff')
  await expect(BlobModule.blobToBinaryString(new globalThis.Blob(['content']))).resolves.toBe('\x00\xff')
  expect(BlobWorker.invoke).toHaveBeenCalledWith('Blob.blobToBinaryString', expect.any(globalThis.Blob))
})
