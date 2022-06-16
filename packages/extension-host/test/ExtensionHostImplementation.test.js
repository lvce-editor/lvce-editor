import * as ExtensionHostImplementation from '../src/parts/ExtensionHostImplementation/ExtensionHostImplementation.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

beforeEach(() => {
  ExtensionHostImplementation.state.implementationProviders =
    Object.create(null)
  TextDocument.state.textDocuments = Object.create(null)
})

test('executeImplementationProvider - no results', async () => {
  ExtensionHostImplementation.registerImplementationProvider({
    languageId: 'javascript',
    async provideImplementations() {
      return []
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  expect(
    await ExtensionHostImplementation.executeImplementationProvider(1, 0)
  ).toEqual([])
})

test('executeImplementationProvider - single result', async () => {
  ExtensionHostImplementation.registerImplementationProvider({
    languageId: 'javascript',
    async provideImplementations() {
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
  expect(
    await ExtensionHostImplementation.executeImplementationProvider(1, 0)
  ).toEqual([
    {
      endOffset: 0,
      lineText: '',
      startOffset: 0,
      uri: '/test/index.js',
    },
  ])
})

test('executeImplementationProvider - error - Implementation provider throws error', async () => {
  ExtensionHostImplementation.registerImplementationProvider({
    languageId: 'javascript',
    provideImplementations() {
      throw new TypeError('x is not a function')
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostImplementation.executeImplementationProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute implementation provider: TypeError: x is not a function'
    )
  )
})

test('executeImplementationProvider - error - ImplementationProvider has wrong shape', async () => {
  ExtensionHostImplementation.registerImplementationProvider({
    languageId: 'javascript',
    // @ts-expect-error
    abc() {},
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostImplementation.executeImplementationProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute implementation provider: TypeError: implementationProvider.provideImplementations is not a function'
    )
  )
})

test('executeImplementationProvider - error - no Implementation provider found', async () => {
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostImplementation.executeImplementationProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute implementation provider: VError: no implementation provider found for javascript'
    )
  )
})
