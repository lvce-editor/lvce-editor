import VError from 'verror'
import * as Hover from '../src/parts/ExtensionHostHover/ExtensionHostHover.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

afterEach(() => {
  Hover.state.hoverProviderMap = Object.create(null)
})

test('registerHoverProvider - no argument provided', () => {
  expect(() => Hover.registerHoverProvider()).toThrowError(
    new Error("Cannot read properties of undefined (reading 'languageId')")
  )
})

test('execute - when hover provider has no result', async () => {
  Hover.registerHoverProvider({
    languageId: 'unknown',
    provideHover(textDocument, offset) {
      return undefined
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(await Hover.executeHoverProvider(1, 1)).toBeUndefined()
})

// TODO test when hover provider returns invalid result
test('execute - when hover provider has normal result', async () => {
  Hover.registerHoverProvider({
    languageId: 'unknown',
    provideHover(textDocument, offset) {
      return {
        label: 'Option A',
        snippet: 'Option A',
      }
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(await Hover.executeHoverProvider(1, 1)).toEqual({
    label: 'Option A',
    snippet: 'Option A',
  })
})

test('execute - when hover provider throws error', async () => {
  Hover.registerHoverProvider({
    languageId: 'unknown',
    provideHover(textDocument, offset) {
      throw new Error('x is not a function')
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  await expect(Hover.executeHoverProvider(1, 1)).rejects.toThrowError(
    new VError('Failed to execute hover provider: x is not a function')
  )
})

test.skip('execute', async () => {
  Hover.registerHoverProvider()
})
