import { beforeEach, expect, jest, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'

const mockFileSystemWorkerInvoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>()

jest.unstable_mockModule('../src/parts/FileSystemWorker/FileSystemWorker.js', () => ({
  invoke: mockFileSystemWorkerInvoke,
}))

const FileSystemFetch = await import('../src/parts/FileSystem/FileSystemFetch.js')

const createJsonResponse = (value: unknown): Response => {
  return new Response(JSON.stringify(value), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

beforeEach(() => {
  jest.resetAllMocks()
  mockFileSystemWorkerInvoke.mockRejectedValue(new Error('Disk file system is not available in web'))
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    value: {
      host: 'example.com',
      protocol: 'https:',
    },
  })
})

test('isReadonly', () => {
  expect(FileSystemFetch.isReadonly()).toBe(true)
})

test('readDirWithFileTypes reads the static file map', async () => {
  const fetch = jest.fn<typeof globalThis.fetch>()
  fetch.mockResolvedValue(createJsonResponse(['/playground/main.zig', '/playground/nested/example.zig', '/playground-other/ignored.zig']))
  globalThis.fetch = fetch

  await expect(FileSystemFetch.readDirWithFileTypes('fetch:///playground')).resolves.toEqual([
    {
      name: 'main.zig',
      type: DirentType.File,
    },
    {
      name: 'nested',
      type: DirentType.Directory,
    },
  ])
  expect(fetch).toHaveBeenCalledWith('/config/fileMap.json')
  expect(mockFileSystemWorkerInvoke).not.toHaveBeenCalled()
})

test('readFile reads a static asset', async () => {
  const fetch = jest.fn<typeof globalThis.fetch>()
  fetch.mockResolvedValue(new Response('const main = () => {}'))
  globalThis.fetch = fetch

  await expect(FileSystemFetch.readFile('fetch:///playground/main.zig')).resolves.toBe('const main = () => {}')
  expect(fetch).toHaveBeenCalledWith('/playground/main.zig')
  expect(mockFileSystemWorkerInvoke).not.toHaveBeenCalled()
})

test('readJson reads a static asset', async () => {
  const fetch = jest.fn<typeof globalThis.fetch>()
  fetch.mockResolvedValue(createJsonResponse({ name: 'zig' }))
  globalThis.fetch = fetch

  await expect(FileSystemFetch.readJson('fetch:///playground/config.json')).resolves.toEqual({ name: 'zig' })
  expect(fetch).toHaveBeenCalledWith('/playground/config.json')
  expect(mockFileSystemWorkerInvoke).not.toHaveBeenCalled()
})
