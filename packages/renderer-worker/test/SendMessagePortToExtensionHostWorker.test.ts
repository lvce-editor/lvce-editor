/* eslint-disable jest/no-restricted-jest-methods -- Worker port tests use ESM module mocks for worker dependencies. */
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

jest.unstable_mockModule('../src/parts/DragAndDropWorker/DragAndDropWorker.js', () => {
  return {
    invokeAndTransfer: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => {
  return {
    invokeAndTransfer: jest.fn(),
  }
})

const DialogWorker = await import('../src/parts/DialogWorker/DialogWorker.js')
const DragAndDropWorker = await import('../src/parts/DragAndDropWorker/DragAndDropWorker.js')
const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')
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

test('sendMessagePortToDragAndDropWorker', async () => {
  const port = {}

  await SendMessagePortToExtensionHostWorker.sendMessagePortToDragAndDropWorker(port, 'DragAndDrop.handleMessagePort')

  expect(DragAndDropWorker.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(DragAndDropWorker.invokeAndTransfer).toHaveBeenCalledWith('DragAndDrop.handleMessagePort', port)
})

test('sendMessagePortToExtensionHostWorker forwards to extension management worker', async () => {
  const port = {}

  await SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker(port, 'HandleMessagePort.handleMessagePort2', 42)

  expect(ExtensionManagementWorker.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(ExtensionManagementWorker.invokeAndTransfer).toHaveBeenCalledWith('Extensions.handleMessagePort', port, 42)
})
