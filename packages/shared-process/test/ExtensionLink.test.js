import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'
import { FileNotFoundError } from '../src/parts/FileNotFoundError/FileNotFoundError.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SymLink/SymLink', () => {
  return {
    createSymLink: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.js', () => {
  return {
    getLinkedExtensionsPath: () => {
      return '/test/linked-extensions'
    },
  }
})

jest.unstable_mockModule('../src/parts/Path/Path.js', () => {
  return {
    join: (a, b) => {
      return a + '/' + b
    },
    basename: (path) => {
      return path.slice(path.lastIndexOf('/') + 1)
    },
  }
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => {
  return {
    remove: jest.fn(() => {
      throw new Error('not implemented')
    }),
    exists: jest.fn(() => {
      throw new Error('not implemented')
    }),
    readFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const SymLink = await import('../src/parts/SymLink/SymLink.js')
const ExtensionLink = await import('../src/parts/ExtensionLink/ExtensionLink.js')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')

class NodeError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

class PermissionDeniedError extends Error {
  constructor(from, to) {
    super(`EPERM: operation not permittet, symlink ${from} -> ${to}`)
    this.code = 'EPERM'
  }
}

test('link', async () => {
  // @ts-ignore
  SymLink.createSymLink.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return '{ "id": "my-extension" }'
  })
  await ExtensionLink.link('/test/my-extension')
  expect(SymLink.createSymLink).toHaveBeenCalledTimes(1)
  expect(SymLink.createSymLink).toHaveBeenCalledWith('/test/my-extension', '/test/linked-extensions/my-extension')
})

// TODO handle ENOENT error when extension folder does not exist

// TODO handl ENOENT error when specified path does not exist

test('link - error - symlink already exists', async () => {
  let i = 0
  // @ts-ignore
  SymLink.createSymLink.mockImplementation(() => {
    switch (i++) {
      case 0:
        throw new NodeError(ErrorCodes.EEXIST)
    }
  })
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return '{ "id": "my-extension" }'
  })
  await ExtensionLink.link('/test/my-extension')
  expect(SymLink.createSymLink).toHaveBeenCalledTimes(2)
  expect(SymLink.createSymLink).toHaveBeenNthCalledWith(1, '/test/my-extension', '/test/linked-extensions/my-extension')
  expect(SymLink.createSymLink).toHaveBeenNthCalledWith(2, '/test/my-extension', '/test/linked-extensions/my-extension')
  expect(FileSystem.remove).toHaveBeenCalledTimes(1)
  expect(FileSystem.remove).toHaveBeenCalledWith('/test/linked-extensions/my-extension')
})

test('link - error - no manifest file found', async () => {
  // @ts-ignore
  FileSystem.readFile.mockImplementation((uri) => {
    throw new FileNotFoundError(uri)
  })
  await expect(ExtensionLink.link('/test/my-extension')).rejects.toThrow(
    new Error("Failed to link extension: Extension manifest not found '/test/my-extension/extension.json'"),
  )
})

test('link - error - permission denied', async () => {
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return '{ "id": "my-extension" }'
  })
  // @ts-ignore
  SymLink.createSymLink.mockImplementation((from, to) => {
    throw new PermissionDeniedError(from, to)
  })
  await expect(ExtensionLink.link('/test/my-extension')).rejects.toThrow(
    new Error('Failed to link extension: EPERM: operation not permittet, symlink /test/my-extension -> /test/linked-extensions/my-extension'),
  )
})
