import * as ExtensionHostCommand from '../src/parts/ExtensionHost/ExtensionHostCommand.js'

test('executeCommand', async () => {
  const fakeExtensionHost = {
    invoke(method, ...params) {
      return {
        params,
      }
    },
  }
  expect(
    await ExtensionHostCommand.executeCommand(fakeExtensionHost, 1, 2, 3)
  ).toEqual({
    params: [1, 2, 3],
  })
})

test('executeCommand - error', async () => {
  const fakeExtensionHost = {
    invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostCommand.executeCommand(fakeExtensionHost)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
