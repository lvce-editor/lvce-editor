import VError from 'verror'
import * as ExtensionHostFormatting from '../src/parts/ExtensionHostFormatting/ExtensionHostFormatting.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

afterEach(() => {
  ExtensionHostFormatting.state.formattingProviders = Object.create(null)
})

// TODO should have better error message
test('registerFormattingProvider - no argument provided', () => {
  expect(() =>
    ExtensionHostFormatting.registerFormattingProvider()
  ).toThrowError(
    new VError(
      "Failed to register formatting provider: TypeError: Cannot read properties of undefined (reading 'id')"
    )
  )
})

test('executeFormattingProvider - when Formatting provider has no result', async () => {
  ExtensionHostFormatting.registerFormattingProvider({
    languageId: 'unknown',
    format(textDocument, offset) {
      return null
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(await ExtensionHostFormatting.executeFormattingProvider(1)).toEqual(
    null
  )
})

test.skip('executeFormattingProvider - when Formatting provider has wrong shape', async () => {
  ExtensionHostFormatting.registerFormattingProvider({
    languageId: 'unknown',
    abc(textDocument, offset) {},
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  await expect(
    ExtensionHostFormatting.executeFormattingProvider(1)
  ).rejects.toThrowError(
    new VError(
      'Failed to execute Formatting provider: TypeError: provider.provideFormattings is not a function'
    )
  )
})

test('executeFormattingProvider - when Formatting provider has normal result', async () => {
  ExtensionHostFormatting.registerFormattingProvider({
    languageId: 'unknown',
    format(textDocument) {
      return ''
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(await ExtensionHostFormatting.executeFormattingProvider(1)).toBe(``)
})

test('executeFormattingProvider - when Formatting provider throws error', async () => {
  ExtensionHostFormatting.registerFormattingProvider({
    languageId: 'unknown',
    format(textDocument, offset) {
      throw new Error('x is not a function')
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  await expect(
    ExtensionHostFormatting.executeFormattingProvider(1)
  ).rejects.toThrowError(
    new VError('Failed to execute formatting provider: x is not a function')
  )
})
