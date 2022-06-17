import * as ExtensionHostFileSystem from '../src/parts/ExtensionHost/ExtensionHostFileSystem.js'

test('readFile', async () => {
  const fakeExtensionHost = {
    async invoke() {
      return ''
    },
  }
  expect(
    await ExtensionHostFileSystem.readFile(
      fakeExtensionHost,
      '/test',
      '/test/file.txt'
    )
  ).toBe('')
})

test('readFile - error', async () => {
  const fakeExtensionHost = {
    async invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostFileSystem.readFile(
      fakeExtensionHost,
      'test',
      '/test/file.txt'
    )
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('writeFile', async () => {
  const fakeExtensionHost = {
    async invoke() {},
  }
  expect(
    await ExtensionHostFileSystem.writeFile(
      fakeExtensionHost,
      '/test',
      '/test/file.txt',
      ''
    )
  ).toBeUndefined()
})

test('writeFile - error', async () => {
  const fakeExtensionHost = {
    async invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostFileSystem.writeFile(
      fakeExtensionHost,
      'test',
      '/test/file.txt',
      ''
    )
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('readDirWithFileTypes', async () => {
  const fakeExtensionHost = {
    async invoke() {
      return []
    },
  }
  expect(
    await ExtensionHostFileSystem.readDirWithFileTypes(
      fakeExtensionHost,
      'test',
      '/test'
    )
  ).toEqual([])
})

test('readDirWithFileTypes - error', async () => {
  const fakeExtensionHost = {
    async invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostFileSystem.readDirWithFileTypes(
      fakeExtensionHost,
      'test',
      '/test'
    )
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
