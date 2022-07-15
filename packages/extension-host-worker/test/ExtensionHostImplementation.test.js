import * as ExtensionHostImplementation from '../src/parts/ExtensionHostImplementation/ExtensionHostImplementation.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

beforeEach(() => {
  ExtensionHostImplementation.reset()
})

test('executeImplementationProvider - no results', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.js',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostImplementation.registerImplementationProvider({
    languageId: 'javascript',
    async provideImplementations() {
      return []
    },
  })
  expect(
    await ExtensionHostImplementation.executeImplementationProvider(1, 0)
  ).toEqual([])
})

test('executeImplementationProvider - single result', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.js',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
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
  TextDocument.setFiles([
    {
      path: '/test.index.js',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostImplementation.registerImplementationProvider({
    languageId: 'javascript',
    provideImplementations() {
      throw new TypeError('x is not a function')
    },
  })
  await expect(
    ExtensionHostImplementation.executeImplementationProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute implementation provider: TypeError: x is not a function'
    )
  )
})

test('executeImplementationProvider - error - ImplementationProvider has wrong shape', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.js',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostImplementation.registerImplementationProvider({
    languageId: 'javascript',
    abc() {},
  })
  await expect(
    ExtensionHostImplementation.executeImplementationProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute implementation provider: VError: implementationProvider.provideImplementations is not a function'
    )
  )
})

test('executeImplementationProvider - error - no Implementation provider found', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.js',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  await expect(
    ExtensionHostImplementation.executeImplementationProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute implementation provider: VError: No implementation provider found for javascript'
    )
  )
})
