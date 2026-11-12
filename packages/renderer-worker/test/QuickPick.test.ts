import { beforeEach, expect, jest, test } from '@jest/globals'

const execute = jest.fn()
const getState = jest.fn()

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute,
}))
jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({
  getState,
}))

const QuickPick = await import('../src/parts/QuickPick/QuickPick.js')
const QuickPickIpc = await import('../src/parts/QuickPick/QuickPick.ipc.js')

beforeEach(() => {
  jest.resetAllMocks()
  getState.mockReturnValue({ aiNativeLayout: false })
})

test('openGoToLine opens the go-to-line quick pick', async () => {
  await QuickPick.openGoToLine()

  expect(execute).toHaveBeenCalledWith('Viewlet.openWidget', 'QuickPick', 'go-to-line')
})

test('openGoToLine is registered as an IPC command', () => {
  expect(QuickPickIpc.Commands.openGoToLine).toBe(QuickPick.openGoToLine)
})

test('showEverything opens chat search in AI-native layout', async () => {
  getState.mockReturnValue({ aiNativeLayout: true })

  await QuickPick.showEveryThing()

  expect(execute).toHaveBeenCalledWith('Viewlet.openWidget', 'QuickPick', 'chats')
})

test('showEverything preserves file search in IDE layout', async () => {
  getState.mockReturnValue({ aiNativeLayout: false })

  await QuickPick.showEveryThing()

  expect(execute).toHaveBeenCalledWith('Viewlet.openWidget', 'QuickPick', 'everything')
})

test('showFile remains an explicit file search in AI-native layout', async () => {
  getState.mockReturnValue({ aiNativeLayout: true })

  await QuickPick.showFile()

  expect(execute).toHaveBeenCalledWith('Viewlet.openWidget', 'QuickPick', 'file')
})
