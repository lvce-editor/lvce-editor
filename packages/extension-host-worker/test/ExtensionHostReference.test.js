import * as ExtensionHostReference from '../src/parts/ExtensionHostReference/ExtensionHostReference.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

test('executeReferenceProvider - no results', async () => {
  const textDocumentRegistry = TextDocument.createRegistry()
  const api = ExtensionHostReference.createApi({ textDocumentRegistry })
  api.registerReferenceProvider({
    languageId: 'javascript',
    async provideReferences() {
      return []
    },
  })
  textDocumentRegistry.syncFull('/test.index.js', 1, 'javascript', '')
  expect(await api.executeReferenceProvider(1, 0)).toEqual([])
})

test('executeReferenceProvider - single result', async () => {
  const textDocumentRegistry = TextDocument.createRegistry()
  const api = ExtensionHostReference.createApi({ textDocumentRegistry })
  api.registerReferenceProvider({
    languageId: 'javascript',
    async provideReferences() {
      return [
        {
          uri: '/test/index.js',
          lineText: '',
          startOffset: 0,
          endOffset: 0,
        },
      ]
    },
  })
  textDocumentRegistry.syncFull('/test.index.js', 1, 'javascript', '')
  expect(await api.executeReferenceProvider(1, 0)).toEqual([
    {
      endOffset: 0,
      lineText: '',
      startOffset: 0,
      uri: '/test/index.js',
    },
  ])
})

test('executeReferenceProvider - error - reference provider throws error', async () => {
  const textDocumentRegistry = TextDocument.createRegistry({
    initialFiles: [
      {
        id: 1,
        path: '/test/index.js',
        languageId: 'javascript',
        content: '',
      },
    ],
  })
  const api = ExtensionHostReference.createApi({ textDocumentRegistry })
  api.registerReferenceProvider({
    languageId: 'javascript',
    provideReferences() {
      throw new TypeError('x is not a function')
    },
  })
  await expect(api.executeReferenceProvider(1, 0)).rejects.toThrowError(
    new Error('Failed to execute reference provider', {
      cause: new TypeError('x is not a function'),
    })
  )
})

test('executeReferenceProvider - error - referenceProvider has wrong shape', async () => {
  const textDocumentRegistry = TextDocument.createRegistry({
    initialFiles: [
      {
        id: 1,
        path: '/test/index.js',
        languageId: 'javascript',
        content: '',
      },
    ],
  })
  const api = ExtensionHostReference.createApi({ textDocumentRegistry })
  api.registerReferenceProvider({
    languageId: 'javascript',
    abc() {},
  })
  await expect(api.executeReferenceProvider(1, 0)).rejects.toThrowError(
    new Error('Failed to execute reference provider', {
      cause: new Error(
        `TypeError: referenceProvider.provideReferences is not a function`
      ),
    })
  )
})

test('executeReferenceProvider - error - no reference provider found', async () => {
  const textDocumentRegistry = TextDocument.createRegistry({
    initialFiles: [
      {
        id: 1,
        path: '/test/index.js',
        languageId: 'javascript',
        content: '',
      },
    ],
  })
  const api = ExtensionHostReference.createApi({ textDocumentRegistry })
  await expect(api.executeReferenceProvider(1, 0)).rejects.toThrowError(
    new Error('Failed to execute reference provider', {
      cause: new Error('no reference provider found for javascript'),
    })
  )
})
