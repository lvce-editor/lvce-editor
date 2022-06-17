import * as ExtensionHostTextDocument from '../src/parts/ExtensionHost/ExtensionHostTextDocument.js'

test('textDocumentSyncInitial', async () => {
  const fakeExtensionHost = {
    invoke() {},
  }
  expect(
    await ExtensionHostTextDocument.textDocumentSyncInitial(
      fakeExtensionHost,
      '/test/file.txt',
      0,
      '',
      ''
    )
  ).toEqual(undefined)
})

test('textDocumentSyncInitial - error', async () => {
  const fakeExtensionHost = {
    async invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostTextDocument.textDocumentSyncInitial(
      fakeExtensionHost,
      '/test/file.txt',
      0,
      '',
      ''
    )
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('textDocumentSyncIncremental', async () => {
  const fakeExtensionHost = {
    invoke() {},
  }
  expect(
    await ExtensionHostTextDocument.textDocumentSyncIncremental(
      fakeExtensionHost,
      0,
      []
    )
  ).toEqual(undefined)
})

test('textDocumentSyncInitial - error', async () => {
  const fakeExtensionHost = {
    async invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostTextDocument.textDocumentSyncIncremental(
      fakeExtensionHost,
      0,
      []
    )
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
