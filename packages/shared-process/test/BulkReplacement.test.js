import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => ({
  readFile: jest.fn(() => {
    throw new Error('not implemented')
  }),
  writeFile: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const BulkReplacement = await import('../src/parts/BulkReplacement/BulkReplacement.js')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')

test('applyBulkReplacement - single file', async () => {
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return 'a'
  })
  const files = ['/test/file.txt']
  const ranges = [4, 0, 0, 0, 1]
  const replacement = 'b'
  await BulkReplacement.applyBulkReplacement(files, ranges, replacement)
  expect(FileSystem.readFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.readFile).toHaveBeenCalledWith('/test/file.txt')
  expect(FileSystem.writeFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.writeFile).toHaveBeenCalledWith('/test/file.txt', 'b')
})

test('applyBulkReplacement - multiple edits in single file', async () => {
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return `a
a`
  })
  const files = ['/test/file.txt']
  const ranges = [8, 0, 0, 0, 1, 1, 0, 1, 1]
  const replacement = 'b'
  await BulkReplacement.applyBulkReplacement(files, ranges, replacement)
  expect(FileSystem.readFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.readFile).toHaveBeenCalledWith('/test/file.txt')
  expect(FileSystem.writeFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.writeFile).toHaveBeenCalledWith(
    '/test/file.txt',
    `b
b`
  )
})

test('applyBulkReplacement - multiple edits in one line', async () => {
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return `aa`
  })
  const files = ['/test/file.txt']
  const ranges = [8, 0, 0, 0, 1, 0, 1, 0, 2]
  const replacement = 'b'
  await BulkReplacement.applyBulkReplacement(files, ranges, replacement)
  expect(FileSystem.readFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.readFile).toHaveBeenCalledWith('/test/file.txt')
  expect(FileSystem.writeFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.writeFile).toHaveBeenCalledWith('/test/file.txt', `bb`)
})
