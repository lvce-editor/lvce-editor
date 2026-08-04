import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/DialogWorker/DialogWorker.js', () => ({
  invoke: jest.fn(async () => ['handleClickButton', 'handleClickClose', 'handleFocusIn']),
}))

const ViewletDialog = await import('../src/parts/ViewletDialog/ViewletDialog.ipc.js')

test('getCommands', async () => {
  const commands = await ViewletDialog.getCommands()

  expect(Object.keys(commands)).toEqual(['handleClickButton', 'handleClickClose', 'handleFocusIn'])
  expect(typeof commands.handleClickButton).toBe('function')
})
