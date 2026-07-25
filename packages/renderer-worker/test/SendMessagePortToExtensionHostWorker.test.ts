import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invokeAndTransfer: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/DialogWorker/DialogWorker.js', () => {
  return {
    invokeAndTransfer: jest.fn(),
  }
})

const DialogWorker = await import('../src/parts/DialogWorker/DialogWorker.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const SendMessagePortToExtensionHostWorker = await import('../src/parts/SendMessagePortToExtensionHostWorker/SendMessagePortToExtensionHostWorker.js')

test('sendMessagePortToProcessExplorer', async () => {
  const port = {}

  await SendMessagePortToExtensionHostWorker.sendMessagePortToProcessExplorer(port)

  expect(SharedProcess.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invokeAndTransfer).toHaveBeenCalledWith('HandleMessagePortForProcessExplorer.handleMessagePortForProcessExplorer', port)
})

test('sendMessagePortToDialogWorker', async () => {
  const port = {}

  await SendMessagePortToExtensionHostWorker.sendMessagePortToDialogWorker(port, 'HandleMessagePort.handleMessagePort')

  expect(DialogWorker.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(DialogWorker.invokeAndTransfer).toHaveBeenCalledWith('HandleMessagePort.handleMessagePort', port)
})
