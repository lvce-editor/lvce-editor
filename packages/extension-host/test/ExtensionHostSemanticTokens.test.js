import * as ExtensionHostSemanticTokens from '../src/parts/ExtensionHostSemanticTokens/ExtensionHostSemanticTokens.js'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.js'

beforeEach(() => {
  ExtensionHostSemanticTokens.state.semanticTokenProviders = Object.create(null)
  TextDocument.state.textDocuments = Object.create(null)
})

test('executeSemanticTokenProvider - no results', async () => {
  ExtensionHostSemanticTokens.registerSemanticTokenProvider({
    languageId: 'javascript',
    provideSemanticTokens: () => {
      return []
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  expect(
    await ExtensionHostSemanticTokens.executeSemanticTokenProvider(1)
  ).toEqual([])
})

test('executeSemanticTokenProvider - error - reference provider throws error', async () => {
  ExtensionHostSemanticTokens.registerSemanticTokenProvider({
    languageId: 'javascript',
    provideSemanticTokens() {
      throw new TypeError('x is not a function')
    },
  })
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostSemanticTokens.executeSemanticTokenProvider(1)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute semantic token provider: TypeError: x is not a function'
    )
  )
})

test('executeSemanticTokenProvider - error - no semantic token provider found', async () => {
  TextDocument.syncFull('/test.index.js', 1, 'javascript', '')
  await expect(
    ExtensionHostSemanticTokens.executeSemanticTokenProvider(1)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute semantic token provider: VError: no semantic token provider found for javascript'
    )
  )
})
