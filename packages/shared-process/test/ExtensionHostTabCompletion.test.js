import * as ExtensionHostTabCompletion from '../src/parts/ExtensionHost/ExtensionHostTabCompletion.js'

test('executeTabCompletionProvider', async () => {
  const fakeExtensionHost = {
    invoke() {
      return {
        inserted: '<div></div>',
        deleted: 0,
        type: /* Snippet */ 2,
      }
    },
  }
  expect(
    await ExtensionHostTabCompletion.executeTabCompletionProvider(
      fakeExtensionHost,
      0,
      0
    )
  ).toEqual({
    inserted: '<div></div>',
    deleted: 0,
    type: /* Snippet */ 2,
  })
})

test('executeTabCompletionProvider - error', async () => {
  const fakeExtensionHost = {
    invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostTabCompletion.executeTabCompletionProvider(fakeExtensionHost)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
