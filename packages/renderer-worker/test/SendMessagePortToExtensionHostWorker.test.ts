import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invokeAndTransfer: jest.fn(),
  }
})

const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const SendMessagePortToExtensionHostWorker = await import('../src/parts/SendMessagePortToExtensionHostWorker/SendMessagePortToExtensionHostWorker.js')

test('sendMessagePortToProcessExplorer', async () => {
  const port = {}

  await SendMessagePortToExtensionHostWorker.sendMessagePortToProcessExplorer(port)

  expect(SharedProcess.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invokeAndTransfer).toHaveBeenCalledWith('HandleMessagePortForProcessExplorer.handleMessagePortForProcessExplorer', port)
})
