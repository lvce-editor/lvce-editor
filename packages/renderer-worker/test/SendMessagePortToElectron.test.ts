/* eslint-disable jest/no-restricted-jest-methods -- Worker port tests use ESM module mocks for worker dependencies. */
import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invokeAndTransfer: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/WorkspaceConnection/WorkspaceConnection.js', () => ({
  connectMessagePort: jest.fn(async () => false),
}))

const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const WorkspaceConnection = await import('../src/parts/WorkspaceConnection/WorkspaceConnection.js')
const SendMessagePortToElectron = await import('../src/parts/SendMessagePortToElectron/SendMessagePortToElectron.js')

const terminalCommand = 'HandleMessagePortForTerminalProcess.handleMessagePortForTerminalProcess'

test('routes a terminal port to the active workspace connection', async () => {
  const port = {}
  jest.mocked(WorkspaceConnection.connectMessagePort).mockResolvedValueOnce(true)

  await SendMessagePortToElectron.sendMessagePortToElectron(port, terminalCommand, 42)

  expect(WorkspaceConnection.connectMessagePort).toHaveBeenCalledWith('terminal-process', port)
  expect(SharedProcess.invokeAndTransfer).not.toHaveBeenCalled()
})

test('falls back to the local shared process without a workspace connection', async () => {
  const port = {}

  await SendMessagePortToElectron.sendMessagePortToElectron(port, terminalCommand, 42)

  expect(WorkspaceConnection.connectMessagePort).toHaveBeenCalledWith('terminal-process', port)
  expect(SharedProcess.invokeAndTransfer).toHaveBeenCalledWith(terminalCommand, port, 42)
})

test('keeps non-terminal Electron ports local', async () => {
  const port = {}
  const command = 'HandleMessagePort.handleMessagePort'

  await SendMessagePortToElectron.sendMessagePortToElectron(port, command, 42)

  expect(WorkspaceConnection.connectMessagePort).not.toHaveBeenCalled()
  expect(SharedProcess.invokeAndTransfer).toHaveBeenCalledWith(command, port, 42)
})
