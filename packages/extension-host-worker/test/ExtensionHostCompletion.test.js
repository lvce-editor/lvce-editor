import * as ExtensionHostCompletion from '../src/parts/ExtensionHostCompletion/ExtensionHostCompletion.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

test('registerCompletionProvider - no argument provided', () => {
  const textDocumentRegistry = TextDocument.createRegistry()
  const api = ExtensionHostCompletion.createApi({ textDocumentRegistry })
  expect(() => api.registerCompletionProvider()).toThrowError(
    new Error("Cannot read properties of undefined (reading 'languageId')")
  )
})

test('executeCompletionProvider - when completion provider has no result', async () => {
  const textDocumentRegistry = TextDocument.createRegistry({
    initialFiles: [
      {
        id: 1,
        path: '/tmp/some-file.txt',
        languageId: 'unknown',
        content: 'sample text',
      },
    ],
  })
  const api = ExtensionHostCompletion.createApi({ textDocumentRegistry })
  api.registerCompletionProvider({
    languageId: 'unknown',
    provideCompletions(textDocument, offset) {
      return []
    },
  })
  expect(await api.executeCompletionProvider(1, 1)).toEqual([])
})

test.skip('execute - when tab completion provider has wrong shape', async () => {
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
  const api = ExtensionHostCompletion.createApi({ textDocumentRegistry })
  api.registerCompletionProvider({
    languageId: 'unknown',
    abc() {},
  })
  await expect(api.executeCompletionProvider(1, 1)).rejects.toThrowError(
    new Error(
      'Failed to execute completion provider: TypeError: completionProvider.provideCompletions is not a function'
    )
  )
})

test('executeCompletionProvider - when completion provider has normal result', async () => {
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
  const api = ExtensionHostCompletion.createApi({ textDocumentRegistry })
  api.registerCompletionProvider({
    languageId: 'unknown',
    provideCompletions(textDocument, offset) {
      return [
        {
          label: 'Option A',
          snippet: 'Option A',
        },
        {
          label: 'Option B',
          snippet: 'Option B',
        },
      ]
    },
  })
  expect(await api.executeCompletionProvider(1, 1)).toEqual([
    {
      label: 'Option A',
      snippet: 'Option A',
    },
    {
      label: 'Option B',
      snippet: 'Option B',
    },
  ])
})

test.skip('executeCompletionProvider - when completion provider throws error', async () => {
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
  const api = ExtensionHostCompletion.createApi({ textDocumentRegistry })
  api.registerCompletionProvider({
    languageId: 'unknown',
    provideCompletions(textDocument, offset) {
      throw new Error('x is not a function')
    },
  })
  await expect(api.executeCompletionProvider(1, 1)).rejects.toThrowError(
    new Error('Failed to execute completion provider: x is not a function')
  )
})
