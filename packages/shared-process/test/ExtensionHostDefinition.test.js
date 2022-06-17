import * as ExtensionHostDefinition from '../src/parts/ExtensionHost/ExtensionHostDefinition.js'

test('executeDefinitionProvider', async () => {
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
    await ExtensionHostDefinition.executeDefinitionProvider(
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

test('executeDefinitionProvider - error', async () => {
  const fakeExtensionHost = {
    invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostDefinition.executeDefinitionProvider(fakeExtensionHost)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
