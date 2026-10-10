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
    expect.stringContaining(encodeURIComponent(JSON.stringify(['application', 'remote-ssh:///project/file.txt']))),
    'editor-file-cache',
  )
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
  expect(headers['x-lvce-editor-file-stat']).toBe('[7,4,123]')
  expect(Date.parse(headers.expires)).toBeGreaterThan(Date.now() + 89 * 24 * 60 * 60 * 1000)
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
