import { beforeEach, expect, jest, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as DomExceptionType from '../src/parts/DomExceptionType/DomExceptionType.js'
import * as FileHandlePermissionType from '../src/parts/FileHandlePermissionType/FileHandlePermissionType.js'
import * as FileHandleType from '../src/parts/FileHandleType/FileHandleType.js'
import { FileNotFoundError } from '../src/parts/FileNotFoundError/FileNotFoundError.js'

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

jest.unstable_mockModule('../src/parts/FileSystemDirectoryHandle/FileSystemDirectoryHandle.js', () => {
  return {
    getDirents: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getChildHandles: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getFileHandle: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/FileSystemHandlePermission/FileSystemHandlePermission.js', () => {
  return {
    requestPermission: jest.fn(() => {
      throw new Error('not implemented')
    }),
    queryPermission: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/PersistentFileHandle/PersistentFileHandle.js', () => {
  return {
    getHandle: jest.fn(() => {
      throw new Error('not implemented')
    }),
    addHandles: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Command = await import('../src/parts/Command/Command.js')

const FileSystemHtml = await import('../src/parts/FileSystem/FileSystemHtml.js')
const FileSystemDirectoryHandle = await import('../src/parts/FileSystemDirectoryHandle/FileSystemDirectoryHandle.js')
const FileSystemHandlePermission = await import('../src/parts/FileSystemHandlePermission/FileSystemHandlePermission.js')
const PersistentFileHandle = await import('../src/parts/PersistentFileHandle/PersistentFileHandle.js')

class NotAllowedError extends Error {
  constructor() {
    super('The request is not allowed by the user agent or the platform in the current context.')
    this.name = 'NotAllowedError'
  }
}

class UserActivationRequiredError extends Error {
  constructor() {
    super('User activation is required to request permissions.')
  }
}

class NoErrorThrownError extends Error {}

/**
 *
 * @param {any} promise
 * @returns {Promise<Error>}
 *  */
const getError = async (promise) => {
  try {
    await promise
    throw new NoErrorThrownError()
  } catch (error) {
    // @ts-ignore
    return error
  }
}

test('getPathSeparator', async () => {
  expect(FileSystemHtml.getPathSeparator()).toBe('/')
})

test('readDirWithFileTypes', async () => {
  // @ts-ignore
  PersistentFileHandle.getHandle.mockImplementation(() => {
    return {}
  })
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
  // @ts-ignore
  FileSystemDirectoryHandle.getChildHandles.mockImplementation(() => {
    return [
      {
        name: 'file-1.txt',
        kind: FileHandleType.File,
      },

      {
        name: 'folder-2',
        kind: FileHandleType.Directory,
      },
    ]
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
  PersistentFileHandle.getHandle.mockImplementation(() => {
    return {}
  })
  // @ts-ignore
  Command.execute.mockImplementation(async (method, ...parameters) => {
    return {
      kind: FileHandleType.Directory,
      name: 'test-folder',
      async *[Symbol.asyncIterator]() {},
    }
  })
  // @ts-ignore
  FileSystemDirectoryHandle.getChildHandles.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(FileSystemHtml.readDirWithFileTypes('test-folder')).rejects.toThrow(
    new Error('failed to read directory: failed to get child handles: TypeError: x is not a function'),
  )
})

test('readDirWithFileTypes - not allowed - fallback succeeds', async () => {
  // @ts-ignore
  PersistentFileHandle.getHandle.mockImplementation(() => {
    return {}
  })
  let i = 0
  let j = 0
  // @ts-ignore
  Command.execute.mockImplementation(async (method, ...parameters) => {
    return {
      kind: FileHandleType.Directory,
      name: 'test-folder',
      async *[Symbol.asyncIterator]() {},
    }
  })
  // @ts-ignore
  FileSystemHandlePermission.requestPermission.mockImplementation(() => {
    return FileHandlePermissionType.Granted
  })
  // @ts-ignore
  FileSystemHandlePermission.queryPermission.mockImplementation(() => {
    switch (i++) {
      case 0:
        return FileHandlePermissionType.Prompt
      case 1:
        return FileHandlePermissionType.Granted
      default:
        return FileHandlePermissionType.Denied
    }
  })
  // @ts-ignore
  FileSystemDirectoryHandle.getChildHandles.mockImplementation(() => {
    if (j++ === 0) {
      throw new NotAllowedError()
    } else {
      return [
        {
          name: 'file-1.txt',
          kind: FileHandleType.File,
        },
        {
          name: 'folder-2',
          kind: FileHandleType.Directory,
        },
      ]
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
  // @ts-ignore
  PersistentFileHandle.getHandle.mockImplementation(() => {
    return {}
  })
  let i = 0
  let j = 0
  // @ts-ignore
  Command.execute.mockImplementation(async (method, ...parameters) => {
    return {
      kind: FileHandleType.Directory,
      name: 'test-folder',
    }
  })
  // @ts-ignore
  FileSystemHandlePermission.requestPermission.mockImplementation(() => {
    return FileHandlePermissionType.Granted
  })
  // @ts-ignore
  FileSystemHandlePermission.queryPermission.mockImplementation(() => {
    switch (i++) {
      case 0:
        return FileHandlePermissionType.Prompt
      case 1:
        return FileHandlePermissionType.Granted
      default:
        return FileHandlePermissionType.Denied
    }
  })
  // @ts-ignore
  FileSystemDirectoryHandle.getChildHandles.mockImplementation(() => {
    const error = j++ === 0 ? new NotAllowedError() : new TypeError('x is not a function')
    throw error
  })
  await expect(FileSystemHtml.readDirWithFileTypes('test-folder')).rejects.toThrow(
    new TypeError('failed to read directory: TypeError: x is not a function'),
  )
})

test('readDirWithFileTypes - error - user activation required', async () => {
  // @ts-ignore
  PersistentFileHandle.getHandle.mockImplementation(() => {
    return {}
  })
  let i = 0
  let j = 0
  // @ts-ignore
  Command.execute.mockImplementation(async (method, ...parameters) => {
    return {
      kind: FileHandleType.Directory,
      name: 'test-folder',
    }
  })
  // @ts-ignore
  FileSystemHandlePermission.requestPermission.mockImplementation(() => {
    return FileHandlePermissionType.Granted
  })
  // @ts-ignore
  FileSystemHandlePermission.queryPermission.mockImplementation(() => {
    switch (i++) {
      case 0:
        return FileHandlePermissionType.Prompt
      case 1:
        return FileHandlePermissionType.Granted
      default:
        return FileHandlePermissionType.Denied
    }
  })
  // @ts-ignore
  FileSystemDirectoryHandle.getChildHandles.mockImplementation(() => {
    const error = j++ === 0 ? new NotAllowedError() : new UserActivationRequiredError()
    throw error
  })
  await expect(FileSystemHtml.readDirWithFileTypes('test-folder')).rejects.toThrow(
    new Error('failed to read directory: User activation is required to request permissions.'),
  )
})

test.skip('writeFile - not allowed', async () => {
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

test('readFile', async () => {
  // @ts-ignore
  PersistentFileHandle.getHandle.mockImplementation(() => {
    return {
      getFile() {
        return {
          text() {
            return 'test'
          },
        }
      },
    }
  })
  expect(await FileSystemHtml.readFile('/test/file.txt')).toBe('test')
})

test('readFile - not found', async () => {
  let i = 0
  // @ts-ignore
  PersistentFileHandle.getHandle.mockImplementation(() => {
    if (i++ === 0) {
      return undefined
    }
    return {}
  })
  // @ts-ignore
  FileSystemDirectoryHandle.getFileHandle.mockImplementation(() => {
    throw new DOMException('A requested file or directory could not be found at the time an operation was processed.', DomExceptionType.NotFoundError)
  })
  const error = await getError(FileSystemHtml.readFile('/test/not-found.txt'))
  expect(error).toBeInstanceOf(FileNotFoundError)
  expect(error.message).toBe("File not found '/test/not-found.txt'")
})
