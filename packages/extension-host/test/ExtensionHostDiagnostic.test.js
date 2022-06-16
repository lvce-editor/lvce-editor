import VError from 'verror'
import * as ExtensionHostDiagnostic from '../src/parts/ExtensionHostDiagnostic/ExtensionHostDiagnostic.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

afterEach(() => {
  ExtensionHostDiagnostic.state.diagnosticProviderMap = Object.create(null)
})

// TODO should have better error message
test('registerDiagnosticProvider - no argument provided', () => {
  expect(() =>
    ExtensionHostDiagnostic.registerDiagnosticProvider()
  ).toThrowError(
    new VError(
      "Failed to register diagnostic provider: TypeError: Cannot read properties of undefined (reading 'languageId')"
    )
  )
})

test('executeDiagnosticProvider - when diagnostic provider has no result', async () => {
  ExtensionHostDiagnostic.registerDiagnosticProvider({
    languageId: 'unknown',
    provideDiagnostics(textDocument, offset) {
      return []
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(await ExtensionHostDiagnostic.executeDiagnosticProvider(1)).toEqual([])
})

test('executeDiagnosticProvider - when diagnostic provider has wrong shape', async () => {
  ExtensionHostDiagnostic.registerDiagnosticProvider({
    languageId: 'unknown',
    abc(textDocument, offset) {},
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  await expect(
    ExtensionHostDiagnostic.executeDiagnosticProvider(1)
  ).rejects.toThrowError(
    new VError(
      'Failed to execute diagnostic provider: TypeError: provider.provideDiagnostics is not a function'
    )
  )
})

test('executeDiagnosticProvider - when diagnostic provider has normal result', async () => {
  ExtensionHostDiagnostic.registerDiagnosticProvider({
    languageId: 'unknown',
    provideDiagnostics(textDocument, offset) {
      return [
        {
          rowIndex: 0, // TODO this should be offset based index
          columnIndex: 5,
          type: /* Error */ 1,
          message: 'Missing Semicolon',
        },
      ]
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(await ExtensionHostDiagnostic.executeDiagnosticProvider(1)).toEqual([
    {
      rowIndex: 0,
      columnIndex: 5,
      type: /* Error */ 1,
      message: 'Missing Semicolon',
    },
  ])
})

test('executeDiagnosticProvider - when diagnostic provider throws error', async () => {
  ExtensionHostDiagnostic.registerDiagnosticProvider({
    languageId: 'unknown',
    provideDiagnostics(textDocument, offset) {
      throw new Error('x is not a function')
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  await expect(
    ExtensionHostDiagnostic.executeDiagnosticProvider(1)
  ).rejects.toThrowError(
    new VError('Failed to execute diagnostic provider: x is not a function')
  )
})
