import { expect, jest, test } from '@jest/globals'

const keyBindings = [{ command: 'Dialog.handleClickClose', key: 1, when: 2 }]

jest.unstable_mockModule('../src/parts/DialogWorker/DialogWorker.js', () => ({
  invoke: jest.fn(async () => keyBindings),
}))

const DialogWorker = await import('../src/parts/DialogWorker/DialogWorker.js')
const ViewletDialogKeyBindings = await import('../src/parts/ViewletDialog/ViewletDialogKeyBindings.js')

test('getKeyBindings', async () => {
  await expect(ViewletDialogKeyBindings.getKeyBindings()).resolves.toBe(keyBindings)
  expect(DialogWorker.invoke).toHaveBeenCalledWith('Dialog.getKeyBindings')
})
