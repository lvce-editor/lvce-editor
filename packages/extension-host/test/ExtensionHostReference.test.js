import * as ExtensionHostReference from '../src/parts/ExtensionHostReference/ExtensionHostReference.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

beforeEach(() => {
  ExtensionHostReference.state.referenceProviders = Object.create(null)
  TextDocument.state.textDocuments = Object.create(null)
})

test('executeReferenceProvider - no results', async () => {
  ExtensionHostReference.registerReferenceProvider({
    languageId: 'javascript',
    async provideReferences() {
      return []
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  expect(await ExtensionHostReference.executeReferenceProvider(1, 0)).toEqual(
    []
  )
})

test('executeReferenceProvider - single result', async () => {
  ExtensionHostReference.registerReferenceProvider({
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
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  expect(await ExtensionHostReference.executeReferenceProvider(1, 0)).toEqual([
    {
      endOffset: 0,
      lineText: '',
      startOffset: 0,
      uri: '/test/index.js',
    },
  ])
})

test('executeReferenceProvider - error - reference provider throws error', async () => {
  ExtensionHostReference.registerReferenceProvider({
    languageId: 'javascript',
    provideReferences() {
      throw new TypeError('x is not a function')
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostReference.executeReferenceProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute reference provider: TypeError: x is not a function'
    )
  )
})

test('executeReferenceProvider - error - referenceProvider has wrong shape', async () => {
  ExtensionHostReference.registerReferenceProvider({
    languageId: 'javascript',
    // @ts-expect-error
    abc() {},
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostReference.executeReferenceProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute reference provider: TypeError: referenceProvider.provideReferences is not a function'
    )
  )
})

test('executeReferenceProvider - error - no reference provider found', async () => {
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostReference.executeReferenceProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute reference provider: VError: no reference provider found for javascript'
    )
  )
})
