import { expect, jest, test } from '@jest/globals'

const listeners = [{ name: 1, params: [] }]

jest.unstable_mockModule('../src/parts/DialogWorker/DialogWorker.js', () => ({
  invoke: jest.fn(async () => listeners),
}))

const AdjustCommands = await import('../src/parts/AdjustCommands/AdjustCommands.js')
const DialogWorker = await import('../src/parts/DialogWorker/DialogWorker.js')
const ViewletDialog = await import('../src/parts/ViewletDialog/ViewletDialog.ipc.js')

test('render', () => {
  expect(ViewletDialog.render[0].isEqual({}, {})).toBe(false)
  expect(ViewletDialog.render[0].apply).toBe(AdjustCommands.apply)
  expect(ViewletDialog.render[0].multiple).toBe(true)
})

test('renderEventListeners', async () => {
  await expect(ViewletDialog.renderEventListeners()).resolves.toBe(listeners)
  expect(DialogWorker.invoke).toHaveBeenCalledWith('Dialog.renderEventListeners')
})
