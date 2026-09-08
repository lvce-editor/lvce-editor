import { expect, jest, test } from '@jest/globals'
import { createHash } from 'node:crypto'

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => ({
  readFile: jest.fn(async () => 'http content'),
}))

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({
  invoke: jest.fn(async () => ({ found: true, result: 'provider content' })),
}))
const FileSystem = await import('../src/parts/ApplicationFileSystem/ApplicationFileSystem.ts')
const SharedFileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const Extensions = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')

test('identical memory URIs belong to separate applications and disposal preserves siblings', async () => {
  await FileSystem.execute('source', 'writeFile', 'memfs:///main.ts', 'source')
  await FileSystem.execute('preview', 'writeFile', 'memfs:///main.ts', 'preview')
  expect(await FileSystem.execute('source', 'readFile', 'memfs:///main.ts')).toBe('source')
  expect(await FileSystem.execute('preview', 'readFile', 'memfs:///main.ts')).toBe('preview')
  FileSystem.dispose('preview')
  expect(await FileSystem.execute('source', 'readFile', 'memfs:///main.ts')).toBe('source')
  expect(await FileSystem.execute('preview', 'exists', 'memfs:///main.ts')).toBe(false)
  FileSystem.dispose('source')
})

test('custom schemes use only the owning application runtime', async () => {
  expect(await FileSystem.execute('preview', 'readFile', 'sample:///README.md')).toBe('provider content')
  expect(Extensions.invoke).toHaveBeenCalledWith(
    'Extensions.invokeForApplication',
    'preview',
    'Extensions.executeFileSystemProviderReadFile',
    'sample',
    'sample:///README.md',
  )
  jest.mocked(Extensions.invoke).mockResolvedValueOnce({ found: false })
  await expect(FileSystem.execute('source', 'readFile', 'sample:///README.md')).rejects.toThrow('No sample filesystem provider in application source')
})

const hash = (content: string): string => createHash('sha256').update(content).digest('hex')

test('batch hashes preserve URI order, content changes, missing files, and application isolation', async () => {
  const uris = ['memfs:///main.ts', 'memfs:///missing.ts', 'memfs:///empty.ts', 'memfs:///folder']
  try {
    await FileSystem.execute('source', 'writeFile', uris[0], 'héllo 🌍')
    await FileSystem.execute('preview', 'writeFile', uris[0], 'preview')
    await FileSystem.execute('source', 'writeFile', uris[2], '')
    await FileSystem.execute('source', 'mkdir', uris[3])
    expect(await FileSystem.execute('source', 'getFileHashes', uris)).toEqual([hash('héllo 🌍'), null, hash(''), null])
    expect(await FileSystem.execute('preview', 'getFileHashes', uris)).toEqual([hash('preview'), null, null, null])
    await FileSystem.execute('source', 'writeFile', uris[0], 'changed')
    expect(await FileSystem.execute('source', 'getFileHashes', [uris[0], uris[0]])).toEqual([hash('changed'), hash('changed')])
    await FileSystem.execute('source', 'remove', uris[0])
    expect(await FileSystem.execute('source', 'getFileHashes', [uris[0]])).toEqual([null])
    expect(await FileSystem.execute('source', 'getFileHashes', [])).toEqual([])
  } finally {
    FileSystem.dispose('source')
    FileSystem.dispose('preview')
  }
})

test('batch hashes read extension providers in the owning application', async () => {
  jest.mocked(Extensions.invoke).mockResolvedValueOnce({ found: false })
  expect(await FileSystem.execute('preview', 'getFileHashes', ['missing:///file.ts', 'sample:///main.ts'])).toEqual([null, hash('provider content')])
  expect(Extensions.invoke).toHaveBeenLastCalledWith(
    'Extensions.invokeForApplication',
    'preview',
    'Extensions.executeFileSystemProviderReadFile',
    'sample',
    'sample:///main.ts',
  )
})

test('batch hashes reject invalid arguments before reading files', async () => {
  await expect(FileSystem.execute('source', 'getFileHashes', 'memfs:///main.ts')).rejects.toThrow('uris must be an array')
  await expect(FileSystem.execute('source', 'getFileHashes', ['memfs:///main.ts', 1])).rejects.toThrow('Application filesystem requires a URI')
})

test('batch hashes support HTTP assets alongside application memory files', async () => {
  await FileSystem.execute('source', 'writeFile', 'memfs:///main.ts', 'memory content')
  try {
    expect(await FileSystem.execute('source', 'getFileHashes', ['https://example.com/eslint.js', 'memfs:///main.ts'])).toEqual([
      hash('http content'),
      hash('memory content'),
    ])
    expect(SharedFileSystem.readFile).toHaveBeenLastCalledWith('https://example.com/eslint.js')
  } finally {
    FileSystem.dispose('source')
  }
})

test('large batches bound concurrent reads and retain the order when reads finish out of order', async () => {
  const uris = Array.from({ length: 65 }, (_, index) => `https://example.com/${index}.js`)
  const pending = uris.map(() => Promise.withResolvers<string>())
  const started = Promise.withResolvers<void>()
  let calls = 0
  jest.mocked(SharedFileSystem.readFile).mockImplementation(async (uri: string) => {
    calls++
    if (calls === 32) started.resolve()
    return pending[uris.indexOf(uri)].promise
  })
  try {
    const result = FileSystem.execute('source', 'getFileHashes', uris)
    await started.promise
    expect(calls).toBe(32)
    for (let index = pending.length - 1; index >= 0; index--) pending[index].resolve(String(index))
    expect(await result).toEqual(uris.map((_, index) => hash(String(index))))
    expect(calls).toBe(65)
  } finally {
    for (const deferred of pending) deferred.resolve('')
    jest.mocked(SharedFileSystem.readFile).mockImplementation(async () => 'http content')
  }
})
