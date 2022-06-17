import * as ExtensionHostDiagnostic from '../src/parts/ExtensionHost/ExtensionHostDiagnostic.js'

test('executeDiagnosticProvider - empty', async () => {
  const fakeExtensionHost = {
    invoke() {
      return []
    },
  }
  expect(
    await ExtensionHostDiagnostic.executeDiagnosticProvider(fakeExtensionHost)
  ).toEqual([])
})

test('executeDiagnosticProvider - error', async () => {
  const fakeExtensionHost = {
    invoke() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(
    ExtensionHostDiagnostic.executeDiagnosticProvider(fakeExtensionHost, 0)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
