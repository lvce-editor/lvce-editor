import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/DialogWorker/DialogWorker.js', () => ({
  invoke: jest.fn(),
}))

const Dialog = await import('../src/parts/Dialog/Dialog.js')
const DialogWorker = await import('../src/parts/DialogWorker/DialogWorker.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('show', async () => {
  const options = {
    message: 'Continue?',
    title: 'Confirm',
  }

  await Dialog.show(options)

  expect(DialogWorker.invoke).toHaveBeenCalledWith('Dialog.show', options)
})

test('showWarning', async () => {
  const options = {
    message: 'Opening folders is not supported.',
    title: 'Unsupported',
  }

  await Dialog.showWarning(options)

  expect(DialogWorker.invoke).toHaveBeenCalledWith('Dialog.showWarning', options)
})
