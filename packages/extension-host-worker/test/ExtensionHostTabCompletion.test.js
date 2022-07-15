import * as ExtensionHostTabCompletion from '../src/parts/ExtensionHostTabCompletion/ExtensionHostTabCompletion.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

beforeEach(() => {
  ExtensionHostTabCompletion.reset()
})
// TODO test when provider has wrong type or delivers wrong result

// TODO should have better error message here
test('registerTabCompletionProvider - no argument provided', () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])
  expect(() =>
    ExtensionHostTabCompletion.registerTabCompletionProvider()
  ).toThrowError(
    new Error("Cannot read properties of undefined (reading 'languageId')")
  )
})

test('execute - when tab completion provider has normal result', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])

  ExtensionHostTabCompletion.registerTabCompletionProvider({
    languageId: 'javascript',
    provideTabCompletion(textDocument, offset) {
      return {
        inserted: '<div></div>',
        deleted: 0,
        type: /* Snippet */ 2,
      }
    },
  })
  expect(
    await ExtensionHostTabCompletion.executeTabCompletionProvider(1, 1)
  ).toEqual({
    deleted: 0,
    inserted: '<div></div>',
    type: 2,
  })
})

test.skip('execute - when tab completion provider has no result', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])

  ExtensionHostTabCompletion.registerTabCompletionProvider({
    languageId: 'javascript',
    provideTabCompletion(textDocument, offset) {
      return undefined
    },
  })
  expect(
    await ExtensionHostTabCompletion.executeTabCompletionProvider(1, 1)
  ).toBeUndefined()
})

// TODO not sure if it would make sense to do runtime validation
// and throw a good error message which would be
// good for extension development but has performance
// overhead (and performance is really important)
test('execute - when tab completion provider has invalid result of type number', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])

  ExtensionHostTabCompletion.registerTabCompletionProvider({
    languageId: 'javascript',
    provideTabCompletion(textDocument, offset) {
      return 42
    },
  })
  await expect(
    ExtensionHostTabCompletion.executeTabCompletionProvider(1, 1)
  ).rejects.toThrowError(
    'Failed to execute tab completion provider: VError: invalid tab completion result: tabCompletion must be of type object but is 42'
  )
})

test('execute - when tab completion provider has wrong shape', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])

  ExtensionHostTabCompletion.registerTabCompletionProvider({
    languageId: 'javascript',
    abc() {},
  })
  await expect(
    ExtensionHostTabCompletion.executeTabCompletionProvider(1, 1)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute tab completion provider: VError: tabCompletionProvider.provideTabCompletion is not a function'
    )
  )
})

test('execute - when tab completion provider throws error', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])

  ExtensionHostTabCompletion.registerTabCompletionProvider({
    languageId: 'javascript',
    provideTabCompletion() {
      throw new Error('x is not a function')
    },
  })
  await expect(
    ExtensionHostTabCompletion.executeTabCompletionProvider(1, 1)
  ).rejects.toThrowError(
    new Error('Failed to execute tab completion provider: x is not a function')
  )
})
