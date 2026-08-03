import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly any[]) => Promise<any>>()

jest.unstable_mockModule('../src/parts/QuickPickWorker/QuickPickWorker.js', () => ({
  invoke,
}))

const ExtensionHostQuickPick = await import('../src/parts/ExtensionHost/ExtensionHostQuickPick.js')

beforeEach(() => {
  invoke.mockReset()
})

test('showQuickPick forwards options to the quick pick worker', async () => {
  invoke.mockResolvedValue('main')
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

test('showQuickInput forwards placeholder and value and returns accepted input', async () => {
  invoke.mockResolvedValue({
    canceled: false,
    inputValue: 'user@example.com',
  })

  await expect(
    ExtensionHostQuickPick.showQuickInput({
      placeholder: 'Enter SSH host',
      value: 'user@',
    }),
  ).resolves.toBe('user@example.com')

  expect(invoke).toHaveBeenCalledWith('QuickPick.showQuickInput', {
    initialValue: 'user@',
    placeholder: 'Enter SSH host',
  })
})

test('showQuickInput returns undefined when canceled', async () => {
  invoke.mockResolvedValue({
    canceled: true,
    inputValue: '',
  })

  await expect(ExtensionHostQuickPick.showQuickInput({ placeholder: 'Enter SSH host' })).resolves.toBeUndefined()
})
