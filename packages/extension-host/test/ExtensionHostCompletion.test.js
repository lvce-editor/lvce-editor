import VError from 'verror'
import * as Completion from '../src/parts/ExtensionHostCompletion/ExtensionHostCompletion.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

afterEach(() => {
  Completion.state.completionProviderMap = Object.create(null)
})

test('registerCompletionProvider - no argument provided', () => {
  expect(() => Completion.registerCompletionProvider()).toThrowError(
    new Error("Cannot read properties of undefined (reading 'languageId')")
  )
})

test('executeCompletionProvider - when completion provider has no result', async () => {
  Completion.registerCompletionProvider({
    languageId: 'unknown',
    provideCompletions(textDocument, offset) {
      return []
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(await Completion.executeCompletionProvider(1, 1)).toEqual([])
})

test('execute - when tab completion provider has wrong shape', async () => {
  Completion.registerCompletionProvider({
    languageId: 'unknown',
    abc() {},
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  await expect(Completion.executeCompletionProvider(1, 1)).rejects.toThrowError(
    // @ts-ignore
    new VError(
      'Failed to execute completion provider: TypeError: completionProvider.provideCompletions is not a function'
    )
  )
})

test('executeCompletionProvider - when completion provider has normal result', async () => {
  Completion.registerCompletionProvider({
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
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  expect(await Completion.executeCompletionProvider(1, 1)).toEqual([
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

test('executeCompletionProvider - when completion provider throws error', async () => {
  Completion.registerCompletionProvider({
    languageId: 'unknown',
    provideCompletions(textDocument, offset) {
      throw new Error('x is not a function')
    },
  })
  TextDocument.syncFull('/tmp/some-file.txt', 1, 'unknown', 'sample text')
  await expect(Completion.executeCompletionProvider(1, 1)).rejects.toThrowError(
    // @ts-ignore
    new VError('Failed to execute completion provider: x is not a function')
  )
})
