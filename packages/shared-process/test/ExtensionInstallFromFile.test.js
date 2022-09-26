import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getExtensionsPath: () => {
    return '/test/extensions'
  },
  getCachedExtensionsPath: () => {
    return '/test/cached-extensions'
  },
}))

jest.unstable_mockModule('../src/parts/Extract/Extract.js', () => ({
  extractTarBr: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))
jest.unstable_mockModule('../src/parts/Path/Path.js', () => ({
  join: (...parts) => {
    return parts.join('/')
  },
  basename: (path) => {
    return path.slice(path.lastIndexOf('/') + 1)
  },
}))

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => ({
  readFile: jest.fn(() => {
    throw new Error('not implemented')
  }),
  remove: jest.fn(() => {
    throw new Error('not implemented')
  }),
  rename: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const ExtensionInstallFromFile = await import(
  '../src/parts/ExtensionInstallFromFile/ExtensionInstallFromFile.js'
)
const Extract = await import('../src/parts/Extract/Extract.js')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const Path = await import('../src/parts/Path/Path.js')

test('install - error with extraction', async () => {
  // @ts-ignore
  Extract.extractTarBr.mockImplementation(() => {
    throw new Error(`Failed to extract`)
  })
  await expect(
    ExtensionInstallFromFile.install({
      path: './extension.tar.br',
    })
  ).rejects.toThrowError(
    new Error('Failed to install ./extension.tar.br: Failed to extract')
  )
})

test('install - error - missing id in extension manifest', async () => {
  // @ts-ignore
  Extract.extractTarBr.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return `{}`
  })
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.rename.mockImplementation(() => {})
  await expect(
    ExtensionInstallFromFile.install({
      path: './extension.tar.br',
    })
  ).rejects.toThrowError(
    new Error(
      `Failed to install ./extension.tar.br: missing id in extension manifest`
    )
  )
})

test('install', async () => {
  // @ts-ignore
  Extract.extractTarBr.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return `{
  "id": "test.test-extension"
}`
  })
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.rename.mockImplementation(() => {})
  await ExtensionInstallFromFile.install({
    path: './extension.tar.br',
  })
  expect(Extract.extractTarBr).toHaveBeenCalledTimes(1)
  expect(Extract.extractTarBr).toHaveBeenCalledWith({
    inFile: './extension.tar.br',
    outDir: '/test/cached-extensions/file-extension',
    strip: 1,
  })
  expect(FileSystem.readFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.readFile).toHaveBeenCalledWith(
    '/test/cached-extensions/file-extension/extension.json'
  )
  expect(FileSystem.rename).toHaveBeenCalledTimes(1)
  expect(FileSystem.rename).toHaveBeenCalledWith(
    '/test/cached-extensions/file-extension',
    '/test/extensions/test.test-extension'
  )
})
