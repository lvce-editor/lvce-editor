import * as ExtensionHostCompletion from '../src/parts/ExtensionHost/ExtensionHostCompletion.js'

test('executeCompletionProvider', async () => {
  const fakeExtensionHost = {
    invoke() {
      return [
        {
          label: 'Option A',
          snippet: 'Option A',
        },
        {
          label: 'Option B',
          snippet: 'Option B',
        },
      ]
    },
  }
  expect(
    await ExtensionHostCompletion.executeCompletionProvider(
      fakeExtensionHost,
      0,
      0
    )
  ).toEqual([
    {
      label: 'Option A',
      snippet: 'Option A',
    },
    {
      label: 'Option B',
      snippet: 'Option B',
    },
  ])
})

test('executeCompletionProvider - error', async () => {
  const fakeExtensionHost = {
    invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostCompletion.executeCompletionProvider(fakeExtensionHost)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
