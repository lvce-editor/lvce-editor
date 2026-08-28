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

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => {
  return {
    invokeAndTransfer: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/ExplorerViewWorker/ExplorerViewWorker.js', () => {
  return {
    invokeAndTransfer: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/MainAreaWorker/MainAreaWorker.js', () => {
  return {
    invokeAndTransfer: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/SettingsWorker/SettingsWorker.js', () => {
  return {
    invokeAndTransfer: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/SecretsViewWorker/SecretsViewWorker.ts', () => {
  return {
    invokeAndTransfer: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/WorkspaceConnection/WorkspaceConnection.js', () => {
  return {
    connectMessagePort: jest.fn(async () => false),
  }
})

const DialogWorker = await import('../src/parts/DialogWorker/DialogWorker.js')
const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')
const ExplorerViewWorker = await import('../src/parts/ExplorerViewWorker/ExplorerViewWorker.js')
const MainAreaWorker = await import('../src/parts/MainAreaWorker/MainAreaWorker.js')
const SecretsViewWorker = await import('../src/parts/SecretsViewWorker/SecretsViewWorker.ts')
const SettingsWorker = await import('../src/parts/SettingsWorker/SettingsWorker.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const WorkspaceConnection = await import('../src/parts/WorkspaceConnection/WorkspaceConnection.js')
const SendMessagePortToExtensionHostWorker = await import('../src/parts/SendMessagePortToExtensionHostWorker/SendMessagePortToExtensionHostWorker.js')

test('sendMessagePortToProcessExplorer', async () => {
  const port = {}

  await SendMessagePortToExtensionHostWorker.sendMessagePortToProcessExplorer(port)

  expect(SharedProcess.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invokeAndTransfer).toHaveBeenCalledWith('HandleMessagePortForProcessExplorer.handleMessagePortForProcessExplorer', port)
  expect(WorkspaceConnection.connectMessagePort).not.toHaveBeenCalled()
})

test('sendMessagePortToFileWatcherExplorer', async () => {
  const port = {}

  await SendMessagePortToExtensionHostWorker.sendMessagePortToFileWatcherExplorer(port)

  expect(WorkspaceConnection.connectMessagePort).toHaveBeenCalledWith('file-watcher-explorer', port)
  expect(SharedProcess.invokeAndTransfer).toHaveBeenCalledWith(
    'HandleMessagePortForFileWatcherExplorer.handleMessagePortForFileWatcherExplorer',
    port,
  )
})

test('sendMessagePortToTerminalProcess uses the workspace connection', async () => {
  const port = {}
  jest.mocked(WorkspaceConnection.connectMessagePort).mockResolvedValueOnce(true)

  await SendMessagePortToExtensionHostWorker.sendMessagePortToTerminalProcess(
    port,
    'HandleMessagePortForTerminalProcess.handleMessagePortForTerminalProcess',
    1,
  )

  expect(WorkspaceConnection.connectMessagePort).toHaveBeenCalledWith('terminal-process', port)
  expect(SharedProcess.invokeAndTransfer).not.toHaveBeenCalled()
})

test('sendMessagePortToDialogWorker', async () => {
  const port = {}

  await SendMessagePortToExtensionHostWorker.sendMessagePortToDialogWorker(port, 'HandleMessagePort.handleMessagePort')

  expect(DialogWorker.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(DialogWorker.invokeAndTransfer).toHaveBeenCalledWith('HandleMessagePort.handleMessagePort', port)
})

test('sendMessagePortToExtensionHostWorker forwards to extension management worker', async () => {
  const port = {}

  await SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker(port, 'HandleMessagePort.handleMessagePort2', 42)

  expect(ExtensionManagementWorker.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(ExtensionManagementWorker.invokeAndTransfer).toHaveBeenCalledWith('Extensions.handleMessagePort', port, 42)
})

test('sendMessagePortToMainAreaWorker forwards to main area worker', async () => {
  const port = {}

  await SendMessagePortToExtensionHostWorker.sendMessagePortToMainAreaWorker(port, 'HandleMessagePort.handleMessagePort', 42)

  expect(MainAreaWorker.invokeAndTransfer).toHaveBeenCalledWith('HandleMessagePort.handleMessagePort', port, 42)
})

test('sendMessagePortToSettingsWorker forwards to settings worker', async () => {
  const port = {}

  await SendMessagePortToExtensionHostWorker.sendMessagePortToSettingsWorker(port, 'HandleMessagePort.handleMessagePort', 42)

  expect(SettingsWorker.invokeAndTransfer).toHaveBeenCalledWith('HandleMessagePort.handleMessagePort', port, 42)
})

test('sendMessagePortToViewWorker forwards to the selected direct view worker', async () => {
  const port = {}

  await SendMessagePortToExtensionHostWorker.sendMessagePortToViewWorker(port, 'Explorer')

  expect(ExplorerViewWorker.invokeAndTransfer).toHaveBeenCalledWith('Explorer.handleMessagePort', port, false)
})

test('sendMessagePortToViewWorker forwards to the secrets view worker', async () => {
  const port = {}

  await SendMessagePortToExtensionHostWorker.sendMessagePortToViewWorker(port, 'SecretsView')

  expect(SecretsViewWorker.invokeAndTransfer).toHaveBeenCalledWith('SecretsView.handleMessagePort', port, false)
})

test('sendMessagePortToViewWorker rejects unknown workers', async () => {
  await expect(SendMessagePortToExtensionHostWorker.sendMessagePortToViewWorker({}, 'Unknown')).rejects.toThrow(
    'direct view worker not found: Unknown',
  )
})
