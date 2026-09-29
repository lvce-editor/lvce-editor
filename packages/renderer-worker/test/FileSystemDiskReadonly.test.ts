import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(method: string, ...params: readonly unknown[]) => Promise<boolean>>()

jest.unstable_mockModule('../src/parts/FileSystemWorker/FileSystemWorker.js', () => ({
  invoke,
}))

const FileSystemDisk = await import('../src/parts/FileSystem/FileSystemDisk.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('isReadonly checks the disk file system', async () => {
  invoke.mockResolvedValue(true)

  expect(await FileSystemDisk.isReadonly('/usr/lib/lvce/resources/app/playground')).toBe(true)
  expect(invoke).toHaveBeenCalledWith('FileSystem.isReadonly', 'file:///usr/lib/lvce/resources/app/playground')
})

test('isReadonly preserves file uris', async () => {
  invoke.mockResolvedValue(false)

  expect(await FileSystemDisk.isReadonly('file:///home/test')).toBe(false)
  expect(invoke).toHaveBeenCalledWith('FileSystem.isReadonly', 'file:///home/test')
})
