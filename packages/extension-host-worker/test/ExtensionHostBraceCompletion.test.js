import * as ExtensionHostBraceCompletion from '../src/parts/ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

test('executeBraceCompletionProvider - true', async () => {
  const textDocumentRegistry = TextDocument.createRegistry({
    initialFiles: [
      { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
    ],
  })
  const api = ExtensionHostBraceCompletion.createApi({
    textDocumentRegistry,
  })
  api.registerBraceCompletionProvider({
    languageId: 'javascript',
    provideBraceCompletion() {
      return true
    },
  })
  expect(await api.executeBraceCompletionProvider(1, 0, '{')).toBe(true)
})

test('executeBraceCompletionProvider - false', async () => {
  const textDocumentRegistry = TextDocument.createRegistry({
    initialFiles: [
      { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
    ],
  })
  const api = ExtensionHostBraceCompletion.createApi({ textDocumentRegistry })
  api.registerBraceCompletionProvider({
    languageId: 'javascript',
    provideBraceCompletion() {
      return false
    },
  })
  expect(await api.executeBraceCompletionProvider(1, 0, '{')).toBe(false)
})

test('executeBraceCompletionProvider - error - result is undefined', async () => {
  const textDocumentRegistry = TextDocument.createRegistry({
    initialFiles: [
      {
        path: '/test.index.js',
        id: 1,
        languageId: 'javascript',
        content: '',
      },
    ],
  })
  const api = ExtensionHostBraceCompletion.createApi({ textDocumentRegistry })
  api.registerBraceCompletionProvider({
    languageId: 'javascript',
    provideBraceCompletion() {
      return undefined
    },
  })
  await expect(api.executeBraceCompletionProvider(1, 0)).rejects.toThrowError(
    new Error(
      'Failed to execute brace completion provider: VError: invalid brace completion result: braceCompletion must be of type boolean but is undefined'
    )
  )
})

test('executeBraceCompletionProvider - error - definition must be of type object but is function', async () => {
  const textDocumentRegistry = TextDocument.createRegistry({
    initialFiles: [
      {
        path: '/test.index.js',
        id: 1,
        languageId: 'javascript',
        content: '',
      },
    ],
  })
  const api = ExtensionHostBraceCompletion.createApi({ textDocumentRegistry })
  api.registerBraceCompletionProvider({
    languageId: 'javascript',
    provideBraceCompletion() {
      return () => {}
    },
  })
  await expect(api.executeBraceCompletionProvider(1, 0)).rejects.toThrowError(
    new Error(
      'Failed to execute brace completion provider: VError: invalid brace completion result: braceCompletion must be of type boolean but is () => {}'
    )
  )
})

test('executeBraceCompletionProvider - error - brace completion provider throws error', async () => {
  const textDocumentRegistry = TextDocument.createRegistry({
    initialFiles: [
      { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
    ],
  })
  const api = ExtensionHostBraceCompletion.createApi({ textDocumentRegistry })
  api.registerBraceCompletionProvider({
    languageId: 'javascript',
    provideBraceCompletion() {
      throw new TypeError('x is not a function')
    },
  })
  await expect(api.executeBraceCompletionProvider(1, 0)).rejects.toThrowError(
    new Error(
      'Failed to execute brace completion provider: TypeError: x is not a function'
    )
  )
})

test('executeBraceCompletionProvider - error - definition provider throws error null', async () => {
  const textDocumentRegistry = TextDocument.createRegistry({
    initialFiles: [
      { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
    ],
  })
  const api = ExtensionHostBraceCompletion.createApi({ textDocumentRegistry })
  api.registerBraceCompletionProvider({
    languageId: 'javascript',
    provideBraceCompletion() {
      throw null
    },
  })
  await expect(api.executeBraceCompletionProvider(1, 0)).rejects.toThrowError(
    new Error('Failed to execute brace completion provider: NonError: null')
  )
})
