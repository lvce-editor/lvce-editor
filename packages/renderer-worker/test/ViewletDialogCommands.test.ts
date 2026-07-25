import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/DialogWorker/DialogWorker.js', () => ({
  invoke: jest.fn(async () => ['handleClickButton', 'handleClickClose', 'handleFocusIn']),
}))

jest.unstable_mockModule('../src/parts/WrapDialogCommand/WrapDialogCommand.js', () => ({
  wrapDialogCommand: jest.fn((command: string) => command),
}))

const ViewletDialogCommands = await import('../src/parts/ViewletDialog/ViewletDialogCommands.js')
const WrapDialogCommand = await import('../src/parts/WrapDialogCommand/WrapDialogCommand.js')

test('getCommands', async () => {
  const commands = await ViewletDialogCommands.getCommands()

  expect(WrapDialogCommand.wrapDialogCommand).toHaveBeenCalledTimes(3)
  expect(commands).toEqual({
    handleClickButton: 'handleClickButton',
    handleClickClose: 'handleClickClose',
    handleFocusIn: 'handleFocusIn',
  })
})
