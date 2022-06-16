import VError from 'verror'
import * as TabCompletion from '../src/parts/ExtensionHostTabCompletion/ExtensionHostTabCompletion.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

// TODO test when corresponding document cannot be found

// TODO test when provider has wrong type or delivers wrong result

afterEach(() => {
  TabCompletion.state.tabCompletionProviderMap = Object.create(null)
})

// TODO should have better error message here
test('registerTabCompletionProvider - no argument provided', () => {
  expect(() => TabCompletion.registerTabCompletionProvider()).toThrowError(
    new Error("Cannot read properties of undefined (reading 'languageId')")
  )
})

test('execute - when tab completion provider has normal result', () => {
  TabCompletion.registerTabCompletionProvider({
    languageId: 'unknown',
    provideTabCompletion(textDocument, offset) {
      return {
        inserted: '<div></div>',
        deleted: 0,
        type: /* Snippet */ 2,
      }
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(TabCompletion.executeTabCompletionProvider(1, 1)).toEqual({
    deleted: 0,
    inserted: '<div></div>',
    type: 2,
  })
})

test('execute - when tab completion provider has no result', () => {
  TabCompletion.registerTabCompletionProvider({
    languageId: 'unknown',
    provideTabCompletion(textDocument, offset) {
      return undefined
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(TabCompletion.executeTabCompletionProvider(1, 1)).toBeUndefined()
})

// TODO not sure if it would make sense to do runtime validation
// and throw a good error message which would be
// good for extension development but has performance
// overhead (and performance is really important)
test('execute - when tab completion provider has invalid result', () => {
  TabCompletion.registerTabCompletionProvider({
    languageId: 'unknown',
    provideTabCompletion(textDocument, offset) {
      return 42
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(TabCompletion.executeTabCompletionProvider(1, 1)).toBe(42)
})

test('execute - when tab completion provider has wrong shape', () => {
  TabCompletion.registerTabCompletionProvider({
    languageId: 'unknown',
    abc() {},
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(() => TabCompletion.executeTabCompletionProvider(1, 1)).toThrowError(
    new VError(
      'Failed to execute tab completion provider: TypeError: tabCompletionProvider.provideTabCompletion is not a function'
    )
  )
})

test('execute - when tab completion provider throws error', () => {
  TabCompletion.registerTabCompletionProvider({
    languageId: 'unknown',
    provideTabCompletion() {
      throw new Error('x is not a function')
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(() => TabCompletion.executeTabCompletionProvider(1, 1)).toThrowError(
    new VError('Failed to execute tab completion provider: x is not a function')
  )
})

test('execute - when no provider is registered', () => {
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(TabCompletion.executeTabCompletionProvider(1, 1)).toBeUndefined()
})

test('execute when error occurs', () => {})
