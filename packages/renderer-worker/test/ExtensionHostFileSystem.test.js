import { jest } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostShared.js',
  () => {
    return {
      executeProvider: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ExtensionHostFileSystem = await import(
  '../src/parts/ExtensionHost/ExtensionHostFileSystem.js'
)
const ExtensionHostShared = await import(
  '../src/parts/ExtensionHost/ExtensionHostShared.js'
)

test('readFile', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    return 'test content'
  })
  expect(await ExtensionHostFileSystem.readFile('memfs:///test.txt')).toBe(
    'test content'
  )
})

test('readFile - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostFileSystem.readFile('memfs:///test.txt')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('remove', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(() => {})
  await ExtensionHostFileSystem.remove('memfs:///test.txt')
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledWith({
    event: 'onFileSystem:memfs',
    method: 'ExtensionHostFileSystem.remove',
    noProviderFoundMessage: 'no file system provider found',
    params: ['memfs', '/test.txt'],
  })
})

test('remove - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostFileSystem.remove('memfs:///test.txt')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('rename', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(() => {})
  await ExtensionHostFileSystem.rename(
    'memfs:///test.txt',
    'memfs:///test2.txt'
  )
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledWith({
    event: 'onFileSystem:memfs',
    method: 'ExtensionHostFileSystem.rename',
    noProviderFoundMessage: 'no file system provider found',
    params: ['memfs', '/test.txt', '/test2.txt'],
  })
})

test('rename - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostFileSystem.rename(
      'memfs',
      'memfs:///test.txt',
      'memfs:///test2.txt'
    )
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('mkdir', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(() => {})
  await ExtensionHostFileSystem.mkdir('memfs:///test-folder')
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledWith({
    event: 'onFileSystem:memfs',
    method: 'ExtensionHostFileSystem.mkdir',
    noProviderFoundMessage: 'no file system provider found',
    params: ['memfs', '/test-folder'],
  })
})

test('mkdir - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostFileSystem.mkdir('memfs:///test-folder')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('writeFile', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(() => {})
  await ExtensionHostFileSystem.writeFile('memfs:///test-folder', 'test')
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledWith({
    event: 'onFileSystem:memfs',
    method: 'ExtensionHostFileSystem.writeFile',
    noProviderFoundMessage: 'no file system provider found',
    params: ['memfs', '/test-folder', 'test'],
  })
})

test('writeFile - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostFileSystem.writeFile('memfs:///test-folder', 'test')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('readDirWithFileTypes', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    return [
      {
        name: 'file 1',
        type: DirentType.File,
      },
      {
        name: 'file 2',
        type: DirentType.File,
      },
      {
        name: 'file 3',
        type: DirentType.File,
      },
    ]
  })
  expect(
    await ExtensionHostFileSystem.readDirWithFileTypes('memfs:///test-folder')
  ).toEqual([
    {
      name: 'file 1',
      type: DirentType.File,
    },
    {
      name: 'file 2',
      type: DirentType.File,
    },
    {
      name: 'file 3',
      type: DirentType.File,
    },
  ])
})

test('readDirWithFileTypes - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostFileSystem.readDirWithFileTypes('memfs:///test-folder')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
