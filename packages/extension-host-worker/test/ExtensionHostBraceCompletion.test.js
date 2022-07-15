import * as ExtensionHostBraceCompletion from '../src/parts/ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

beforeEach(() => {
  ExtensionHostBraceCompletion.reset()
})

test('executeBraceCompletionProvider - true', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])
  ExtensionHostBraceCompletion.registerBraceCompletionProvider({
    languageId: 'javascript',
    provideBraceCompletion() {
      return true
    },
  })
  expect(
    await ExtensionHostBraceCompletion.executeBraceCompletionProvider(1, 0, '{')
  ).toBe(true)
})

test('executeBraceCompletionProvider - false', async () => {
  TextDocument.setFiles([
    { path: '/test.index.js', id: 1, languageId: 'javascript', content: '' },
  ])
  ExtensionHostBraceCompletion.registerBraceCompletionProvider({
    languageId: 'javascript',
    provideBraceCompletion() {
      return false
    },
  })
  expect(
    await ExtensionHostBraceCompletion.executeBraceCompletionProvider(1, 0, '{')
  ).toBe(false)
})

test('executeBraceCompletionProvider - error - result is undefined', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.js',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostBraceCompletion.registerBraceCompletionProvider({
    languageId: 'javascript',
    provideBraceCompletion() {
      return undefined
    },
  })
  await expect(
    ExtensionHostBraceCompletion.executeBraceCompletionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute brace completion provider: VError: invalid brace completion result: braceCompletion must be of type boolean but is undefined'
    )
  )
})

test('executeBraceCompletionProvider - error - definition must be of type object but is function', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.js',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostBraceCompletion.registerBraceCompletionProvider({
    languageId: 'javascript',
    provideBraceCompletion() {
      return () => {}
    },
  })
  await expect(
    ExtensionHostBraceCompletion.executeBraceCompletionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute brace completion provider: VError: invalid brace completion result: braceCompletion must be of type boolean but is () => {}'
    )
  )
})

test('executeBraceCompletionProvider - error - brace completion provider throws error', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.js',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostBraceCompletion.registerBraceCompletionProvider({
    languageId: 'javascript',
    provideBraceCompletion() {
      throw new TypeError('x is not a function')
    },
  })
  await expect(
    ExtensionHostBraceCompletion.executeBraceCompletionProvider(1, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute brace completion provider: TypeError: x is not a function'
    )
  )
})

test('executeBraceCompletionProvider - error - definition provider throws error null', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.js',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostBraceCompletion.registerBraceCompletionProvider({
    languageId: 'javascript',
    provideBraceCompletion() {
      throw null
    },
  })
  await expect(
    ExtensionHostBraceCompletion.executeBraceCompletionProvider(1, 0)
  ).rejects.toThrowError(
    new Error('Failed to execute brace completion provider: NonError: null')
  )
})
