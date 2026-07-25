import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/DialogWorker/DialogWorker.js', () => ({
  invoke: jest.fn(),
}))

const DialogWorker = await import('../src/parts/DialogWorker/DialogWorker.js')
const WrapDialogCommand = await import('../src/parts/WrapDialogCommand/WrapDialogCommand.js')
const invoke = jest.mocked(DialogWorker.invoke)

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns updated render commands', async () => {
  invoke.mockImplementation(async (command: string) => {
    if (command === 'Dialog.diff2') {
      return [1]
    }
    if (command === 'Dialog.render2') {
      return [['Viewlet.setDom2', []]]
    }
    return undefined
  })
  const state = { commands: [], id: 7 }

  const result = await WrapDialogCommand.wrapDialogCommand('handleFocusIn')(state, 1)

  expect(DialogWorker.invoke).toHaveBeenNthCalledWith(1, 'Dialog.handleFocusIn', 7, 1)
  expect(DialogWorker.invoke).toHaveBeenNthCalledWith(2, 'Dialog.diff2', 7)
  expect(DialogWorker.invoke).toHaveBeenNthCalledWith(3, 'Dialog.render2', 7, [1])
  expect(result).toEqual({
    commands: [['Viewlet.setDom2', []]],
    id: 7,
  })
})

test('returns the existing state when there are no render commands', async () => {
  invoke.mockResolvedValue([])
  const state = { commands: [], id: 7 }

  const result = await WrapDialogCommand.wrapDialogCommand('handleClickClose')(state)

  expect(result).toBe(state)
})
