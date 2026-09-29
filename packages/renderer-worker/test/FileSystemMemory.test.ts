import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/FileSystemWorker/FileSystemWorker.js', () => {
  return {
    invoke: jest.fn(() => undefined),
  }
})

const FileSystemWorker = await import('../src/parts/FileSystemWorker/FileSystemWorker.js')
const FileSystemMemory = await import('../src/parts/FileSystem/FileSystemMemory.js')

test('writeBlob writes UTF-8 text to the memory filesystem', async () => {
  const blob = new Blob(['hello'])

  await FileSystemMemory.writeBlob('memfs:///workspace/file.txt', blob)

  expect(FileSystemWorker.invoke).toHaveBeenCalledWith('FileSystem.writeFile', 'memfs:///workspace/file.txt', 'hello')
})

test('writeBlob rejects binary content in the text-only memory filesystem', async () => {
  const blob = new Blob([new Uint8Array([0xff, 0x00])])

  await expect(FileSystemMemory.writeBlob('memfs:///workspace/image.png', blob)).rejects.toThrow('The encoded data was not valid for encoding utf-8')
  expect(FileSystemWorker.invoke).not.toHaveBeenCalled()
})
