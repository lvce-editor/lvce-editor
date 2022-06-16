import VError from 'verror'
import * as Rename from '../src/parts/ExtensionHostRename/ExtensionHostRename.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

// TODO test missing parameter

// TODO test invalid parameters

test.skip('registerRenameProvider', () => {})

test('registerRenameProvider - no argument provided', () => {
  expect(() => Rename.registerRenameProvider()).toThrowError(
    new Error(
      "Failed to register rename provider: TypeError: Cannot read properties of undefined (reading 'languageId')"
    )
  )
})

test('executePrepareRename - when rename provider throws error', async () => {
  Rename.registerRenameProvider({
    languageId: 'unknown',
    prepareRename(textDocument, offset) {
      throw new Error('x is not a function')
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  await expect(Rename.executePrepareRename(1, 1)).rejects.toThrowError(
    new VError('Failed to execute rename provider: x is not a function')
  )
})

test('executePrepareRename - when rename provider has wrong shape', async () => {
  Rename.registerRenameProvider({
    languageId: 'unknown',
    abc() {},
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  await expect(Rename.executePrepareRename(1, 1)).rejects.toThrowError(
    new VError(
      'Failed to execute rename provider: TypeError: renameProvider.prepareRename is not a function'
    )
  )
})

test('executeRename - when rename provider throws error', async () => {
  Rename.registerRenameProvider({
    languageId: 'unknown',
    rename(textDocument, offset) {
      throw new Error('x is not a function')
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  await expect(Rename.executeRename(1, 1)).rejects.toThrowError(
    new VError('Failed to execute rename provider: x is not a function')
  )
})
