import * as ExtensionHostRename from '../src/parts/ExtensionHost/ExtensionHostRename.js'

test('executePrepareRename', async () => {
  const fakeExtensionHost = {
    invoke() {
      return {
        canRename: true,
      }
    },
  }
  expect(
    await ExtensionHostRename.executePrepareRename(fakeExtensionHost, 0, 0)
  ).toEqual({
    canRename: true,
  })
})

test('executePrepareRename - error', async () => {
  const fakeExtensionHost = {
    invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostRename.executePrepareRename(fakeExtensionHost, 0, 0)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('executeRename', async () => {
  const fakeExtensionHost = {
    invoke() {
      return [
        {
          file: '/test/file.txt',
          edits: [],
        },
      ]
    },
  }
  expect(
    await ExtensionHostRename.executeRename(fakeExtensionHost, 0, 0, '')
  ).toEqual([
    {
      file: '/test/file.txt',
      edits: [],
    },
  ])
})

test('executeRename - error', async () => {
  const fakeExtensionHost = {
    invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostRename.executeRename(fakeExtensionHost, 0, 0, '')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
