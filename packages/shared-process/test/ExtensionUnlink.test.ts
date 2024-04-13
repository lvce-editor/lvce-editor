import { beforeEach, expect, jest, test } from '@jest/globals'
import { FileNotFoundError } from '../src/parts/FileNotFoundError/FileNotFoundError.js'

beforeEach(() => {
  jest.resetAllMocks()
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
    readFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/RemoveSymlink/RemoveSymlink.js', () => {
  return {
    removeSymlink: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RemoveSymlink = await import('../src/parts/RemoveSymlink/RemoveSymlink.js')
const ExtensionUnlink = await import('../src/parts/ExtensionUnlink/ExtensionUnlink.js')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')

class NodeError extends Error {
  code: any
  constructor(code) {
    super(code)
    this.code = code
  }
}

test('unlink', async () => {
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return '{ "id": "my-extension" }'
  })
  // @ts-ignore
  RemoveSymlink.removeSymlink.mockImplementation(() => {})
  await ExtensionUnlink.unlink('/test/documents/my-extension')
  expect(RemoveSymlink.removeSymlink).toHaveBeenCalledTimes(1)
  expect(RemoveSymlink.removeSymlink).toHaveBeenCalledWith('/test/linked-extensions/my-extension')
})

test('link - error - no manifest file found', async () => {
  // @ts-ignore
  FileSystem.readFile.mockImplementation((uri) => {
    throw new FileNotFoundError(uri)
  })
  await expect(ExtensionUnlink.unlink('/test/documents/my-extension')).rejects.toThrow(
    new Error(
      "Failed to unlink extension: Failed to load extension manifest for my-extension: File not found: '/test/documents/my-extension/extension.json'",
    ),
  )
})
