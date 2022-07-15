import * as ExtensionHostReference from '../src/parts/ExtensionHostReference/ExtensionHostReference.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

beforeEach(() => {
  ExtensionHostReference.reset()
})

test('executeReferenceProvider - no results', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.js',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostReference.registerReferenceProvider({
    languageId: 'javascript',
    async provideReferences() {
      return []
    },
  })
  expect(await ExtensionHostReference.executeReferenceProvider(1, 0)).toEqual(
    []
  )
})

test('executeReferenceProvider - single result', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.js',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
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
  TextDocument.setFiles([
    {
      path: '/test.index.js',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostReference.registerReferenceProvider({
    languageId: 'javascript',
    provideReferences() {
      throw new TypeError('x is not a function')
    },
  })
  await expect(
    ExtensionHostReference.executeReferenceProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute reference provider: TypeError: x is not a function'
    )
  )
})

test('executeReferenceProvider - error - referenceProvider has wrong shape', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.js',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostReference.registerReferenceProvider({
    languageId: 'javascript',
    abc() {},
  })
  await expect(
    ExtensionHostReference.executeReferenceProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute reference provider: VError: referenceProvider.provideReferences is not a function'
    )
  )
})

test('executeReferenceProvider - error - no reference provider found', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.js',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  await expect(
    ExtensionHostReference.executeReferenceProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      `Failed to execute reference provider: VError: No reference provider found for javascript`
    )
  )
})
