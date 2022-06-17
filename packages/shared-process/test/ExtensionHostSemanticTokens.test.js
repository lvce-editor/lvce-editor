import * as ExtensionHostSemanticTokens from '../src/parts/ExtensionHost/ExtensionHostSemanticTokens.js'

test('executeSemanticTokenProvider', async () => {
  const fakeExtensionHost = {
    invoke() {
      return [1, 2, 3, 4, 5]
    },
  }
  expect(
    await ExtensionHostSemanticTokens.executeSemanticTokenProvider(
      fakeExtensionHost,
      0
    )
  ).toEqual([1, 2, 3, 4, 5])
})

test('executeCompletionProvider - error', async () => {
  const fakeExtensionHost = {
    invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostSemanticTokens.executeSemanticTokenProvider(fakeExtensionHost)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
