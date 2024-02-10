import * as ExtensionHostQuickPick from '../src/parts/ExtensionHostQuickPick/ExtensionHostQuickPick.js'

test('showQuickPick', async () => {
  await expect(ExtensionHostQuickPick.showQuickPick()).rejects.toThrow(new Error(`not implemented`))
})
