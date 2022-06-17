import * as ExtensionHostWorkspace from '../src/parts/ExtensionHost/ExtensionHostWorkspace.js'

test('setWorkspacePath', async () => {
  const fakeExtensionHost = {
    invoke() {},
  }
  expect(
    await ExtensionHostWorkspace.setWorkspacePath(fakeExtensionHost, '/test')
  ).toEqual(undefined)
})

test('setWorkspacePath - error', async () => {
  const fakeExtensionHost = {
    async invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostWorkspace.setWorkspacePath(fakeExtensionHost, '/test')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
