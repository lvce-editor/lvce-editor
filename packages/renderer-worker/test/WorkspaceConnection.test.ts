import { beforeEach, expect, jest, test } from '@jest/globals'

interface MockWebSocket {
  onclose?: () => void
  onmessage?: (event: { readonly data: string }) => void
  readonly send: (value: string) => void
}

const create = jest.fn<(options: { readonly getUrl: () => Promise<string>; readonly type: string }) => Promise<MockWebSocket>>()
const executeCommand = jest.fn<(command: string, type: string) => Promise<unknown>>()
const workspaceState = { workspaceUri: '' }

jest.unstable_mockModule('../src/parts/WorkspaceState/WorkspaceState.js', () => ({ state: workspaceState }))
jest.unstable_mockModule('../src/parts/IpcParentWithWebSocket/IpcParentWithWebSocket.js', () => ({ create }))
jest.unstable_mockModule('../src/parts/ExtensionHost/ExtensionHostCommands.js', () => ({ executeCommand }))

const WorkspaceConnection = await import('../src/parts/WorkspaceConnection/WorkspaceConnection.js')

beforeEach(() => {
  WorkspaceConnection.reset()
  workspaceState.workspaceUri = ''
  create.mockReset()
  executeCommand.mockReset()
})

test('gets a process WebSocket URL through the extension command', async () => {
  workspaceState.workspaceUri = 'workspace-provider://host/work'
  WorkspaceConnection.set(
    'workspace-provider://host/work',
    'workspace-provider.getWebSocketUrl',
    'wss://workspace.example.com/remote-cli',
  )
  executeCommand.mockResolvedValue('wss://workspace.example.com/process')

  await expect(WorkspaceConnection.getWebSocketUrl('terminal-process')).resolves.toBe('wss://workspace.example.com/process')
  expect(executeCommand).toHaveBeenCalledWith('workspace-provider.getWebSocketUrl', 'terminal-process')
  expect(WorkspaceConnection.isActive()).toBe(true)
  expect(WorkspaceConnection.getCommand()).toBe('workspace-provider.getWebSocketUrl')
  expect(WorkspaceConnection.getRemoteCliUrl()).toBe('wss://workspace.example.com/remote-cli')
})

test('derives a process WebSocket URL from the workspace connection', async () => {
  workspaceState.workspaceUri = 'workspace-provider://host/work'
  WorkspaceConnection.set(
    'workspace-provider://host/work',
    'workspace-provider.getWebSocketUrl',
    'wss://workspace.example.com/websocket/shared-process?token=secret',
    'wss://workspace.example.com/websocket/file-system-process?token=secret',
  )

  await expect(WorkspaceConnection.getWebSocketUrl('terminal-process')).resolves.toBe(
    'wss://workspace.example.com/websocket/terminal-process?token=secret',
  )
  expect(executeCommand).not.toHaveBeenCalled()
  expect(WorkspaceConnection.getWebSocketUrlTemplate()).toBe(
    'wss://workspace.example.com/websocket/file-system-process?token=secret',
  )
})

test('does not invoke the extension command for a different workspace', async () => {
  workspaceState.workspaceUri = 'file:///tmp/work'
  WorkspaceConnection.set('workspace-provider://host/work', 'workspace-provider.getWebSocketUrl')

  await expect(WorkspaceConnection.getWebSocketUrl('terminal-process')).resolves.toBe('')
  expect(executeCommand).not.toHaveBeenCalled()
  expect(WorkspaceConnection.isActive()).toBe(false)
  expect(WorkspaceConnection.getCommand()).toBe('')
  expect(WorkspaceConnection.getRemoteCliUrl()).toBe('')
  expect(WorkspaceConnection.getWebSocketUrlTemplate()).toBe('')
})

test('rejects a non-WebSocket URL returned by the extension command', async () => {
  workspaceState.workspaceUri = 'workspace-provider://host/work'
  WorkspaceConnection.set('workspace-provider://host/work', 'workspace-provider.getWebSocketUrl')
  executeCommand.mockResolvedValue('https://workspace.example.com/process')

  await expect(WorkspaceConnection.getWebSocketUrl('terminal-process')).rejects.toThrow(/WebSocket URL/)
})

test('rejects a non-WebSocket remote CLI URL', () => {
  expect(() =>
    WorkspaceConnection.set(
      'workspace-provider://host/work',
      'workspace-provider.getWebSocketUrl',
      'https://workspace.example.com/remote-cli',
    ),
  ).toThrow('Remote CLI URL must use WebSocket')
})

test('rejects a non-WebSocket workspace URL', () => {
  expect(() =>
    WorkspaceConnection.set(
      'workspace-provider://host/work',
      'workspace-provider.getWebSocketUrl',
      '',
      'https://workspace.example.com/process',
    ),
  ).toThrow('Workspace WebSocket URL must use WebSocket')
})

test('bridges a message port to the workspace connection', async () => {
  workspaceState.workspaceUri = 'workspace-provider://host/work'
  WorkspaceConnection.set('workspace-provider://host/work', 'workspace-provider.getWebSocketUrl')
  executeCommand.mockResolvedValue('wss://workspace.example.com/process?token=secret')
  const webSocket: MockWebSocket = {
    send: jest.fn<(value: string) => void>(),
  }
  create.mockResolvedValue(webSocket)
  const port = {
    close: jest.fn(),
    onmessage: undefined as undefined | ((event: { readonly data: unknown }) => void),
    postMessage: jest.fn(),
    start: jest.fn(),
  }

  await expect(
    WorkspaceConnection.connectMessagePort('extension-node-process', port, {
      extensionId: 'builtin.codex',
      rpcId: 'builtin.codex.app-server',
    }),
  ).resolves.toBe(true)
  expect(create).toHaveBeenCalledWith({
    getUrl: expect.any(Function),
    type: 'extension-node-process',
  })
  const getUrl = create.mock.calls[0]?.[0].getUrl
  await expect(getUrl()).resolves.toBe('wss://workspace.example.com/process?token=secret&extensionId=builtin.codex&rpcId=builtin.codex.app-server')
  expect(executeCommand).toHaveBeenCalledWith('workspace-provider.getWebSocketUrl', 'extension-node-process')
  port.onmessage?.({ data: ['request'] })
  expect(webSocket.send).toHaveBeenCalledWith('["request"]')
  webSocket.onmessage?.({ data: '["response"]' })
  expect(port.postMessage).toHaveBeenCalledWith(['response'])
})
