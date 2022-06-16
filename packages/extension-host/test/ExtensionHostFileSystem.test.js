import { jest } from '@jest/globals'
import * as ExtensionHostFileSystem from '../src/parts/ExtensionHostFileSystem/ExtensionHostFileSystem.js'

beforeEach(() => {
  ExtensionHostFileSystem.state.fileSystemProviderMap = Object.create(null)
})

test('readDirWithFileTypes', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    async readDirWithFileTypes() {
      return [
        {
          name: 'abc.txt',
          type: 'file',
        },
      ]
    },
  })
  expect(
    await ExtensionHostFileSystem.readDirWithFileTypes('memfs', 'memfs://abc')
  ).toEqual([
    {
      name: 'abc.txt',
      type: 'file',
    },
  ])
})

test('readDirWithFileTypes - when file system provider throws error', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    async readDirWithFileTypes() {
      throw new Error('x is not a function')
    },
  })
  await expect(
    ExtensionHostFileSystem.readDirWithFileTypes('memfs', 'memfs://abc')
  ).rejects.toThrowError(
    new Error('Failed to execute file system provider: x is not a function')
  )
})

test('readFile', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    async readFile() {
      return 'abc'
    },
  })
  expect(
    await ExtensionHostFileSystem.readFile('memfs', 'memfs://abc.txt')
  ).toBe('abc')
})

test('readFile - when file system provider throws error', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    async readFile() {
      throw new Error('x is not a function')
    },
  })
  await expect(
    ExtensionHostFileSystem.readFile('memfs', 'memfs://abc.txt')
  ).rejects.toThrowError(
    new Error('Failed to execute file system provider: x is not a function')
  )
})

test('remove', async () => {
  const fileSystemProvider = {
    id: 'memfs',
    remove: jest.fn(),
  }
  ExtensionHostFileSystem.registerFileSystemProvider(fileSystemProvider)
  await ExtensionHostFileSystem.remove('memfs', 'memfs://abc.txt')
  expect(fileSystemProvider.remove).toHaveBeenCalledWith('memfs://abc.txt')
})

test('remove - when file system provider throws error', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    async remove() {
      throw new Error('x is not a function')
    },
  })
  await expect(
    ExtensionHostFileSystem.remove('memfs', 'memfs://abc.txt')
  ).rejects.toThrowError(
    new Error('Failed to execute file system provider: x is not a function')
  )
})

test('rename', async () => {
  const fileSystemProvider = {
    id: 'memfs',
    rename: jest.fn(),
  }
  ExtensionHostFileSystem.registerFileSystemProvider(fileSystemProvider)
  await ExtensionHostFileSystem.rename(
    'memfs',
    'memfs://abc.txt',
    'memfs://def.txt'
  )
  expect(fileSystemProvider.rename).toHaveBeenCalledWith(
    'memfs://abc.txt',
    'memfs://def.txt'
  )
})

test('rename - when file system provider throws error', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    async rename() {
      throw new Error('x is not a function')
    },
  })
  await expect(
    ExtensionHostFileSystem.rename(
      'memfs',
      'memfs://abc.txt',
      'memfs://def.txt'
    )
  ).rejects.toThrowError(
    new Error('Failed to execute file system provider: x is not a function')
  )
})

test('rename - when file system provider is not registered', async () => {
  await expect(
    ExtensionHostFileSystem.rename(
      'memfs',
      'memfs://abc.txt',
      'memfs://def.txt'
    )
  ).rejects.toThrowError(
    new Error(
      'Failed to execute file system provider: VError: no file system provider for protocol "memfs" found'
    )
  )
})

test('getPathSeparator - slash', () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    pathSeparator: '/',
    async readDirWithFileTypes() {
      return [
        {
          name: 'abc.txt',
          type: 'file',
        },
      ]
    },
  })
  expect(ExtensionHostFileSystem.getPathSeparator('memfs')).toBe('/')
})

test('getPathSeparator - backslash', () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    pathSeparator: '\\',
    async readDirWithFileTypes() {
      return [
        {
          name: 'abc.txt',
          type: 'file',
        },
      ]
    },
  })
  expect(ExtensionHostFileSystem.getPathSeparator('memfs')).toBe('\\')
})
