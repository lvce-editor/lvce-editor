import { jest } from '@jest/globals'
import * as FileHandleType from '../src/parts/FileHandleType/FileHandleType.js'
import * as DirentType from '../src/parts/DirentType/DirentType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Command = await import('../src/parts/Command/Command.js')

const FileSystemHtml = await import('../src/parts/FileSystem/FileSystemHtml.js')

test('getPathSeparator', async () => {
  expect(FileSystemHtml.getPathSeparator()).toBe('/')
})

test('readDirWithFileTypes', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(async (method, ...parameters) => {
    return {
      kind: FileHandleType.Directory,
      name: 'test-folder',
      async *[Symbol.asyncIterator]() {
        yield [
          'file-1.txt',
          {
            name: 'file-1.txt',
            kind: FileHandleType.File,
          },
        ]
        yield [
          'folder-2',
          {
            name: 'file-2',
            kind: FileHandleType.Directory,
          },
        ]
      },
    }
  })
  expect(await FileSystemHtml.readDirWithFileTypes('test-folder')).toEqual([
    {
      type: DirentType.File,
      name: 'file-1.txt',
    },
    {
      type: DirentType.Directory,
      name: 'folder-2',
    },
  ])
})
