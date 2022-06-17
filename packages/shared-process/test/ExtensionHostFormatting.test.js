import * as ExtensionHostFormatting from '../src/parts/ExtensionHost/ExtensionHostFormatting.js'

test('executeFormattingProvider', async () => {
  const fakeExtensionHost = {
    invoke() {
      return ''
    },
  }
  expect(
    await ExtensionHostFormatting.format(
      fakeExtensionHost,
      '/test/file.txt',
      ''
    )
  ).toEqual('')
})

test('executeFormattingProvider - error', async () => {
  const fakeExtensionHost = {
    invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostFormatting.format(fakeExtensionHost, '/test/file.txt', '')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
