import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({
  invoke: jest.fn(async () => ({ found: true, result: 'provider content' })),
}))
const FileSystem = await import('../src/parts/ApplicationFileSystem/ApplicationFileSystem.ts')
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
