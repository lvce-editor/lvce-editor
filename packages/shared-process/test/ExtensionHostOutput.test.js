import * as ExtensionHostOutput from '../src/parts/ExtensionHost/ExtensionHostOutput.js'

test('getOutputChannels - empty', async () => {
  const fakeExtensionHost = {
    async invoke() {
      return []
    },
  }
  expect(
    await ExtensionHostOutput.getOutputChannels(fakeExtensionHost)
  ).toEqual([])
})

test('getOutputChannels - error', async () => {
  const fakeExtensionHost = {
    async invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostOutput.getOutputChannels(fakeExtensionHost)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
