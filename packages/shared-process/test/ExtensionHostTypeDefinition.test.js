import * as ExtensionHostTypeDefinition from '../src/parts/ExtensionHost/ExtensionHostTypeDefinition.js'

test('executeTypeDefinitionProvider', async () => {
  const fakeExtensionHost = {
    invoke() {
      return {
        uri: '/test/file.txt',
        startOffset: 0,
        endOffset: 0,
      }
    },
  }
  expect(
    await ExtensionHostTypeDefinition.executeTypeDefinitionProvider(
      fakeExtensionHost,
      0,
      0
    )
  ).toEqual({
    uri: '/test/file.txt',
    startOffset: 0,
    endOffset: 0,
  })
})

test('executeTypeDefinitionProvider - error', async () => {
  const fakeExtensionHost = {
    invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostTypeDefinition.executeTypeDefinitionProvider(fakeExtensionHost)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
