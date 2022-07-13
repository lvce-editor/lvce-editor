import * as ExtensionHostTabCompletion from '../src/parts/ExtensionHostTabCompletion/ExtensionHostTabCompletion.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

// TODO test when provider has wrong type or delivers wrong result

// TODO should have better error message here
test('registerTabCompletionProvider - no argument provided', () => {
  const textDocumentRegistry = TextDocument.createRegistry()
  const api = ExtensionHostTabCompletion.createApi({ textDocumentRegistry })
  expect(() => api.registerTabCompletionProvider()).toThrowError(
    new Error("Cannot read properties of undefined (reading 'languageId')")
  )
})

test('execute - when tab completion provider has normal result', async () => {
  const textDocumentRegistry = TextDocument.createRegistry({
    initialFiles: [
      {
        path: '/tmp/some-file.txt',
        id: 1,
        languageId: 'unknown',
        content: 'sample text',
      },
    ],
  })
  const api = ExtensionHostTabCompletion.createApi({ textDocumentRegistry })
  api.registerTabCompletionProvider({
    languageId: 'unknown',
    provideTabCompletion(textDocument, offset) {
      return {
        inserted: '<div></div>',
        deleted: 0,
        type: /* Snippet */ 2,
      }
    },
  })
  expect(await api.executeTabCompletionProvider(1, 1)).toEqual({
    deleted: 0,
    inserted: '<div></div>',
    type: 2,
  })
})

test.skip('execute - when tab completion provider has no result', async () => {
  const textDocumentRegistry = TextDocument.createRegistry({
    initialFiles: [
      {
        path: '/tmp/some-file.txt',
        id: 1,
        languageId: 'unknown',
        content: 'sample text',
      },
    ],
  })
  const api = ExtensionHostTabCompletion.createApi({ textDocumentRegistry })

  api.registerTabCompletionProvider({
    languageId: 'unknown',
    provideTabCompletion(textDocument, offset) {
      return undefined
    },
  })
  expect(await api.executeTabCompletionProvider(1, 1)).toBeUndefined()
})

// TODO not sure if it would make sense to do runtime validation
// and throw a good error message which would be
// good for extension development but has performance
// overhead (and performance is really important)
test('execute - when tab completion provider has invalid result of type number', async () => {
  const textDocumentRegistry = TextDocument.createRegistry({
    initialFiles: [
      {
        path: '/tmp/some-file.txt',
        id: 1,
        languageId: 'unknown',
        content: 'sample text',
      },
    ],
  })
  const api = ExtensionHostTabCompletion.createApi({ textDocumentRegistry })
  api.registerTabCompletionProvider({
    languageId: 'unknown',
    provideTabCompletion(textDocument, offset) {
      return 42
    },
  })
  await expect(api.executeTabCompletionProvider(1, 1)).rejects.toThrowError(
    'Failed to execute tab completion provider: VError: invalid tab completion result: tabCompletion must be of type object but is 42'
  )
})

test('execute - when tab completion provider has wrong shape', async () => {
  const textDocumentRegistry = TextDocument.createRegistry({
    initialFiles: [
      {
        path: '/tmp/some-file.txt',
        id: 1,
        languageId: 'unknown',
        content: 'sample text',
      },
    ],
  })
  const api = ExtensionHostTabCompletion.createApi({ textDocumentRegistry })
  api.registerTabCompletionProvider({
    languageId: 'unknown',
    abc() {},
  })
  await expect(api.executeTabCompletionProvider(1, 1)).rejects.toThrowError(
    new Error(
      'Failed to execute tab completion provider: VError: tabCompletionProvider.provideTabCompletion is not a function'
    )
  )
})

test('execute - when tab completion provider throws error', async () => {
  const textDocumentRegistry = TextDocument.createRegistry({
    initialFiles: [
      {
        path: '/tmp/some-file.txt',
        id: 1,
        languageId: 'unknown',
        content: 'sample text',
      },
    ],
  })
  const api = ExtensionHostTabCompletion.createApi({ textDocumentRegistry })
  api.registerTabCompletionProvider({
    languageId: 'unknown',
    provideTabCompletion() {
      throw new Error('x is not a function')
    },
  })
  await expect(api.executeTabCompletionProvider(1, 1)).rejects.toThrowError(
    new Error('Failed to execute tab completion provider: x is not a function')
  )
})
