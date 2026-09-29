import { beforeEach, expect, jest, test } from '@jest/globals'

const execute = jest.fn()

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute,
}))

const QuickPick = await import('../src/parts/QuickPick/QuickPick.js')
const QuickPickIpc = await import('../src/parts/QuickPick/QuickPick.ipc.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('openGoToLine opens the go-to-line quick pick', async () => {
  await QuickPick.openGoToLine()

  expect(execute).toHaveBeenCalledWith('Viewlet.openWidget', 'QuickPick', 'go-to-line')
})

test('openGoToLine is registered as an IPC command', () => {
  expect(QuickPickIpc.Commands.openGoToLine).toBe(QuickPick.openGoToLine)
})
