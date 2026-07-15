import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn(async (..._args) => 'main')

jest.unstable_mockModule('../src/parts/QuickPickWorker/QuickPickWorker.js', () => ({
  invoke,
}))

const ExtensionHostQuickPick = await import('../src/parts/ExtensionHost/ExtensionHostQuickPick.js')

test('showQuickPick forwards options to the quick pick worker', async () => {
  const options = {
    items: [
      {
        label: 'main',
        value: 'main',
      },
    ],
    placeholder: 'Select a branch',
  }
  await expect(ExtensionHostQuickPick.showQuickPick(options)).resolves.toBe('main')

  expect(invoke).toHaveBeenCalledWith('QuickPick.showQuickPick', options)
})
