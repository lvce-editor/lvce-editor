import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: unknown[]) => Promise<unknown>>()
jest.unstable_mockModule('../src/parts/FileSystemWorker/FileSystemWorker.js', () => ({ invoke }))
const FileSystemHtml = await import('../src/parts/FileSystem/FileSystemHtml.js')
const PersistentFileHandle = await import('../src/parts/PersistentFileHandle/PersistentFileHandle.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test.each([
  ['exists', 'FileSystem.exists'],
  ['readDirWithFileTypes', 'FileSystem.readDirWithFileTypes'],
  ['readFile', 'FileSystem.readFile'],
  ['remove', 'FileSystem.remove'],
  ['mkdir', 'FileSystem.mkdir'],
  ['isReadonly', 'FileSystem.isReadonly'],
  ['getBlob', 'FileSystem.readFileAsBlob'],
])('%s runs in the filesystem worker', async (method, command) => {
  const result = { value: 'worker result' }
  invoke.mockResolvedValue(result)
  expect(await FileSystemHtml[method]('html:///workspace/file.txt')).toBe(result)
  expect(invoke).toHaveBeenCalledWith(command, 'html:///workspace/file.txt')
})

test('saves text and binary content without conversion', async () => {
  const uri = 'html:///workspace/file.txt'
  const blob = new Blob([new Uint8Array([0, 255])])
  await FileSystemHtml.writeFile(uri, 'content')
  await FileSystemHtml.writeBlob(uri, blob)
  expect(invoke.mock.calls).toEqual([
    ['FileSystem.writeFile', uri, 'content'],
    ['FileSystem.writeBlob', uri, blob],
  ])
})

test('picker registration and cache access use the same worker owner', async () => {
  const uri = 'html:///selected.txt'
  const handle = { file: new File(['content'], 'selected.txt'), kind: 'file', name: 'selected.txt', readonly: true }
  await PersistentFileHandle.addHandle(uri, handle)
  await PersistentFileHandle.getHandle(uri)
  await PersistentFileHandle.removeHandle(uri)
  expect(invoke.mock.calls).toEqual([
    ['PersistentFileHandle.addHandle', uri, handle],
    ['PersistentFileHandle.getHandle', uri],
    ['PersistentFileHandle.removeHandle', uri],
  ])
})

test('blob URLs are created by the renderer owner from the worker blob', async () => {
  const blob = new Blob(['content'])
  invoke.mockResolvedValue(blob)
  const src = await FileSystemHtml.getBlobSrc('html:///workspace/file.txt')
  try {
    expect(await (await fetch(src)).text()).toBe('content')
    expect(invoke).toHaveBeenCalledWith('FileSystem.readFileAsBlob', 'html:///workspace/file.txt')
  } finally {
    URL.revokeObjectURL(src)
  }
})
