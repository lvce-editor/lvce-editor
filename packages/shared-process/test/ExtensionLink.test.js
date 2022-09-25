import { jest } from '@jest/globals'
import * as FileSystemErrorCodes from '../src/parts/FileSystemErrorCodes/FileSystemErrorCodes.js'

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

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getExtensionsPath: jest.fn(() => {
      return '/test/extensions'
    }),
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

const SymLink = await import('../src/parts/SymLink/SymLink.js')
const ExtensionLink = await import(
  '../src/parts/ExtensionLink/ExtensionLink.js'
)
const Platform = await import('../src/parts/Platform/Platform.js')

class NodeError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

test('link', async () => {
  // @ts-ignore
  SymLink.createSymLink.mockImplementation(() => {})
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => {
    return '/test/extensions'
  })
  await ExtensionLink.link('/test/my-extension')
  expect(SymLink.createSymLink).toHaveBeenCalledTimes(1)
  expect(SymLink.createSymLink).toHaveBeenCalledWith(
    '/test/my-extension',
    '/test/extensions/my-extension'
  )
})

// TODO handle ENOENT error when extension folder does not exist

// TODO handl ENOENT error when specified path does not exist

test.skip('link - error - symlink already exists', async () => {
  let i = 0
  // @ts-ignore
  SymLink.createSymLink.mockImplementation(() => {
    switch (i++) {
      case 0:
        throw new NodeError(FileSystemErrorCodes.EEXIST)
    }
  })
  // @ts-ignore
  Platform.getExtensionsPath.mockImplementation(() => {
    return '/test/extensions'
  })
  await ExtensionLink.link('/test/my-extension')
  expect(SymLink.createSymLink).toHaveBeenCalledTimes(2)
  expect(SymLink.createSymLink).toHaveBeenNthCalledWith(
    1,
    '/test/my-extension',
    '/test/extensions/my-extension'
  )
  expect(SymLink.createSymLink).toHaveBeenNthCalledWith(
    2,
    '/test/my-extension',
    '/test/extensions/my-extension'
  )
})
