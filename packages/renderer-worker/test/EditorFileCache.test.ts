import { afterEach, expect, jest, test } from '@jest/globals'

const cacheWorkerInvoke = jest.fn<(...args: any[]) => Promise<any>>()
const applicationFileSystemExecute = jest.fn<(...args: any[]) => Promise<any>>()
const fileSystemStat = jest.fn<(...args: any[]) => Promise<any>>()

jest.unstable_mockModule('../src/parts/CacheWorker/CacheWorker.js', () => ({
  invoke: cacheWorkerInvoke,
}))

jest.unstable_mockModule('../src/parts/ApplicationFileSystem/ApplicationFileSystem.ts', () => ({
  execute: applicationFileSystemExecute,
}))

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => ({
  statWithMetadata: fileSystemStat,
}))

const EditorFileCache = await import('../src/parts/EditorFileCache/EditorFileCache.js')

afterEach(() => {
  cacheWorkerInvoke.mockReset()
  applicationFileSystemExecute.mockReset()
  fileSystemStat.mockReset()
})

test('getEditorFileCache reads only a matching, unexpired text entry', async () => {
  const body = new TextEncoder().encode('cached content').buffer
  cacheWorkerInvoke.mockResolvedValue({
    body,
    headers: {
      expires: new Date(Date.now() + 60_000).toUTCString(),
      'x-lvce-editor-file-stat': '[7,14,123]',
    },
  })

  await expect(EditorFileCache.get('application', 'remote-ssh:///project/file.txt', '[7,14,123]')).resolves.toBe('cached content')
  expect(cacheWorkerInvoke).toHaveBeenCalledWith(
    'Cache.getCacheStorageItem',
    'https://lvce-editor.invalid/editor-file-cache/remote-ssh/project/file.txt?applicationId=application&leadingSlashes=3',
    'editor-file-cache',
  )
})

test('getEditorFileCache uses readable file and memfs cache paths', async () => {
  cacheWorkerInvoke.mockResolvedValue(undefined)

  await EditorFileCache.get('', 'file:///home/user/project/package.json', '[7,14,123]')
  await EditorFileCache.get('', 'memfs:///workspace/src/index.ts', '[7,14,123]')

  expect(cacheWorkerInvoke.mock.calls[0][1]).toBe('https://lvce-editor.invalid/editor-file-cache/file/home/user/project/package.json?leadingSlashes=3')
  expect(cacheWorkerInvoke.mock.calls[1][1]).toBe('https://lvce-editor.invalid/editor-file-cache/memfs/workspace/src/index.ts?leadingSlashes=3')
})

test('getEditorFileCache keeps application and URI identities distinct', async () => {
  cacheWorkerInvoke.mockResolvedValue(undefined)

  await EditorFileCache.get('application-a', 'memfs:///workspace/file.ts', '[7,14,123]')
  await EditorFileCache.get('application-b', 'memfs:///workspace/file.ts', '[7,14,123]')
  await EditorFileCache.get('application-a', 'memfs:/workspace/file.ts', '[7,14,123]')
  await EditorFileCache.get('application-a', 'memfs:///workspace/file%2F.ts', '[7,14,123]')
  await EditorFileCache.get('application-a', 'memfs:///workspace/file.ts?version=1#section', '[7,14,123]')
  await EditorFileCache.get('application-a', 'memfs:///workspace/../file.ts', '[7,14,123]')

  const keys = cacheWorkerInvoke.mock.calls.map((call) => call[1])
  expect(new Set(keys).size).toBe(keys.length)
  expect(keys[0]).toBe('https://lvce-editor.invalid/editor-file-cache/memfs/workspace/file.ts?applicationId=application-a&leadingSlashes=3')
  expect(keys[1]).toBe('https://lvce-editor.invalid/editor-file-cache/memfs/workspace/file.ts?applicationId=application-b&leadingSlashes=3')
  expect(keys[2]).toBe('https://lvce-editor.invalid/editor-file-cache/memfs/workspace/file.ts?applicationId=application-a&leadingSlashes=1')
  expect(keys[3]).toContain('file%252F.ts?applicationId=application-a')
  expect(keys[4]).toContain('file.ts%3Fversion%3D1%23section?applicationId=application-a&leadingSlashes=3')
  expect(keys[5]).toContain('%252E%252E/file.ts?applicationId=application-a&leadingSlashes=3')
})

test('get, set, and remove use the same cache key', async () => {
  cacheWorkerInvoke.mockImplementation(async (command) => {
    if (command === 'Cache.getCacheStorageItem') {
      return {
        body: new ArrayBuffer(0),
        headers: {
          expires: new Date(Date.now() + 60_000).toUTCString(),
          'x-lvce-editor-file-stat': '[7,4,123]',
        },
      }
    }
    return { success: true }
  })
  fileSystemStat.mockResolvedValue({ mtimeMs: 123, size: 4, type: 7 })

  await EditorFileCache.get('', 'file:///project/file.txt', '[7,4,123]')
  await EditorFileCache.set('', 'file:///project/file.txt', '[7,4,123]', 'text')
  await EditorFileCache.remove('', 'file:///project/file.txt')

  const cacheKeys = cacheWorkerInvoke.mock.calls.filter(([command]) => command.startsWith('Cache.')).map((call) => call[1])
  expect(new Set(cacheKeys).size).toBe(1)
})

test('getEditorFileCache removes expired entries', async () => {
  cacheWorkerInvoke.mockResolvedValue(undefined)
  cacheWorkerInvoke.mockResolvedValueOnce({
    body: new ArrayBuffer(0),
    headers: {
      expires: new Date(Date.now() - 60_000).toUTCString(),
      'x-lvce-editor-file-stat': '[7,14,123]',
    },
  })

  await expect(EditorFileCache.get('', 'file:///project/file.txt', '[7,14,123]')).resolves.toBeNull()
  await new Promise((resolve) => setImmediate(resolve))

  expect(cacheWorkerInvoke).toHaveBeenCalledWith('Cache.removeCacheStorageItem', expect.any(String), 'editor-file-cache')
})

test('setEditorFileCache stores text with an expiry after confirming freshness', async () => {
  applicationFileSystemExecute.mockResolvedValue({ mtimeMs: 123, size: 4, type: 7 })
  cacheWorkerInvoke.mockResolvedValue({ success: true })

  await EditorFileCache.set('application', 'remote-ssh:///project/file.txt', '[7,4,123]', 'text')

  expect(applicationFileSystemExecute).toHaveBeenCalledWith('application', 'statWithMetadata', 'remote-ssh:///project/file.txt')
  const [, , , , headers] = cacheWorkerInvoke.mock.calls[0]
  expect(headers['content-type']).toBe('text/plain; charset=utf-8')
  expect(headers['content-length']).toBe('4')
  expect(headers['x-lvce-editor-file-stat']).toBe('[7,4,123]')
  expect(Date.parse(headers.expires)).toBeGreaterThan(Date.now() + 89 * 24 * 60 * 60 * 1000)
})

test.each([
  ['ASCII content', 'text', '4'],
  ['multibyte Unicode content', 'café 🌍', '10'],
  ['empty content', '', '0'],
])('setEditorFileCache sets the UTF-8 content length for %s', async (_description, content, expectedLength) => {
  const contentLength = new TextEncoder().encode(content).byteLength
  fileSystemStat.mockResolvedValue({ mtimeMs: 123, size: contentLength, type: 7 })
  cacheWorkerInvoke.mockResolvedValue({ success: true })

  await EditorFileCache.set('', 'file:///project/file.txt', `[7,${contentLength},123]`, content)

  const headers = cacheWorkerInvoke.mock.calls[0][4]
  expect(headers['content-length']).toBe(expectedLength)
})

test('setEditorFileCache does not store a file changed after it was read', async () => {
  fileSystemStat.mockResolvedValue({ mtimeMs: 456, size: 4, type: 7 })

  await EditorFileCache.set('', 'file:///project/file.txt', '[7,4,123]', 'text')

  expect(cacheWorkerInvoke).not.toHaveBeenCalled()
})

test('setEditorFileCache excludes secrets and entries larger than 500 kB', async () => {
  const oversizedContent = 'x'.repeat(500_001)
  await EditorFileCache.set('', 'file:///project/.env.local', '[7,5,123]', 'secret')
  await EditorFileCache.set('', 'file:///project/file.txt', '[7,500001,123]', oversizedContent)

  expect(cacheWorkerInvoke).not.toHaveBeenCalled()
})

test('setEditorFileCache accepts content at the 500 kB limit', async () => {
  fileSystemStat.mockResolvedValue({ mtimeMs: 123, size: 500_000, type: 7 })
  cacheWorkerInvoke.mockResolvedValue({ success: true })

  await EditorFileCache.set('', 'file:///project/file.txt', '[7,500000,123]', 'x'.repeat(500_000))

  expect(cacheWorkerInvoke).toHaveBeenCalledWith(
    'Cache.setCacheStorageItem',
    expect.any(String),
    expect.any(String),
    'editor-file-cache',
    expect.objectContaining({ 'content-type': 'text/plain; charset=utf-8' }),
  )
})
