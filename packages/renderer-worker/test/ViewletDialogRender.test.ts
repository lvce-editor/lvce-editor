import { expect, jest, test } from '@jest/globals'

const listeners = [{ name: 1, params: [] }]

jest.unstable_mockModule('../src/parts/DialogWorker/DialogWorker.js', () => ({
  invoke: jest.fn(async () => listeners),
}))

const AdjustCommands = await import('../src/parts/AdjustCommands/AdjustCommands.js')
const DialogWorker = await import('../src/parts/DialogWorker/DialogWorker.js')
const ViewletDialogRender = await import('../src/parts/ViewletDialog/ViewletDialogRender.js')

test('renderDialog', () => {
  expect(ViewletDialogRender.renderDialog.isEqual({}, {})).toBe(false)
  expect(ViewletDialogRender.renderDialog.apply).toBe(AdjustCommands.apply)
  expect(ViewletDialogRender.renderDialog.multiple).toBe(true)
})

test('renderEventListeners', async () => {
  await expect(ViewletDialogRender.renderEventListeners()).resolves.toBe(listeners)
  expect(DialogWorker.invoke).toHaveBeenCalledWith('Dialog.renderEventListeners')
})
