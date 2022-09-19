import { jest } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as FileHandlePermissionType from '../src/parts/FileHandlePermissionType/FileHandlePermissionType.js'
import * as FileHandleType from '../src/parts/FileHandleType/FileHandleType.js'

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
jest.unstable_mockModule(
  '../src/parts/FileSystemHandle/FileSystemHandle.js',
  () => {
    return {
      requestPermission: jest.fn(() => {
        throw new Error('not implemented')
      }),
      queryPermission: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const Command = await import('../src/parts/Command/Command.js')

const FileSystemHtml = await import('../src/parts/FileSystem/FileSystemHtml.js')
const FileSystemHandle = await import(
  '../src/parts/FileSystemHandle/FileSystemHandle.js'
)

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

test('readDirWithFileTypes - error', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(async (method, ...parameters) => {
    return {
      kind: FileHandleType.Directory,
      name: 'test-folder',
      async *[Symbol.asyncIterator]() {
        throw new TypeError('x is not a function')
      },
    }
  })
  await expect(
    FileSystemHtml.readDirWithFileTypes('test-folder')
  ).rejects.toThrowError(
    new Error('failed to read directory: TypeError: x is not a function')
  )
})

test('readDirWithFileTypes - not allowed - fallback succeeds', async () => {
  class NotAllowedError extends Error {
    constructor() {
      super(
        'The request is not allowed by the user agent or the platform in the current context.'
      )
      this.name = 'NotAllowedError'
    }
  }
  let i = 0
  let j = 0
  // @ts-ignore
  Command.execute.mockImplementation(async (method, ...parameters) => {
    return {
      kind: FileHandleType.Directory,
      name: 'test-folder',
      async *[Symbol.asyncIterator]() {
        if (j++ === 0) {
          throw new NotAllowedError()
        } else {
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
        }
      },
    }
  })
  // @ts-ignore
  FileSystemHandle.requestPermission.mockImplementation(() => {
    return FileHandlePermissionType.Granted
  })
  // @ts-ignore
  FileSystemHandle.queryPermission.mockImplementation(() => {
    switch (i++) {
      case 0:
        return FileHandlePermissionType.Prompt
      case 1:
        return FileHandlePermissionType.Granted
      default:
        return FileHandlePermissionType.Denied
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

test('readDirWithFileTypes - not allowed - fallback fails', async () => {
  class NotAllowedError extends Error {
    constructor() {
      super(
        'The request is not allowed by the user agent or the platform in the current context.'
      )
      this.name = 'NotAllowedError'
    }
  }
  let i = 0
  let j = 0
  // @ts-ignore
  Command.execute.mockImplementation(async (method, ...parameters) => {
    return {
      kind: FileHandleType.Directory,
      name: 'test-folder',
      async *[Symbol.asyncIterator]() {
        if (j++ === 0) {
          throw new NotAllowedError()
        } else {
          throw new TypeError('x is not a function')
        }
      },
    }
  })
  // @ts-ignore
  FileSystemHandle.requestPermission.mockImplementation(() => {
    return FileHandlePermissionType.Granted
  })
  // @ts-ignore
  FileSystemHandle.queryPermission.mockImplementation(() => {
    switch (i++) {
      case 0:
        return FileHandlePermissionType.Prompt
      case 1:
        return FileHandlePermissionType.Granted
      default:
        return FileHandlePermissionType.Denied
    }
  })
  await expect(
    FileSystemHtml.readDirWithFileTypes('test-folder')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test.skip('writeFile - not allowed', async () => {
  class NotAllowedError extends Error {
    constructor() {
      super(
        'The request is not allowed by the user agent or the platform in the current context.'
      )
      this.name = 'NotAllowedError'
    }
  }
  // @ts-ignore
  Command.execute.mockImplementation(async (method, ...parameters) => {
    return {
      kind: FileHandleType.Directory,
      name: 'test-folder',
      async *[Symbol.asyncIterator]() {
        throw new NotAllowedError()
      },
    }
  })
  expect(await FileSystemHtml.readDirWithFileTypes('test-folder')).toEqual([])
})
