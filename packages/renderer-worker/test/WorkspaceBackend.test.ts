import { beforeEach, expect, jest, test } from '@jest/globals'

interface MockWebSocket {
  onclose?: () => void
  onmessage?: (event: { readonly data: string }) => void
  readonly send: (value: string) => void
}

const create = jest.fn<() => Promise<MockWebSocket>>()
const workspaceState = { workspaceUri: '' }

jest.unstable_mockModule('../src/parts/WorkspaceState/WorkspaceState.js', () => ({ state: workspaceState }))
jest.unstable_mockModule('../src/parts/IpcParentWithWebSocket/IpcParentWithWebSocket.js', () => ({ create }))

const WorkspaceBackend = await import('../src/parts/WorkspaceBackend/WorkspaceBackend.js')

beforeEach(() => {
  WorkspaceBackend.reset()
  workspaceState.workspaceUri = ''
  create.mockReset()
})

test('returns an authenticated WebSocket URL for the matching workspace', () => {
  workspaceState.workspaceUri = 'remote-ssh://host/work'
  WorkspaceBackend.set('remote-ssh://host/work', 'ws://127.0.0.1:45123', 'secret')

  expect(WorkspaceBackend.getWebSocketUrl('terminal-process')).toBe('ws://127.0.0.1:45123/websocket/terminal-process?token=secret')
})

test('does not affect a different workspace', () => {
  workspaceState.workspaceUri = 'file:///tmp/work'
  WorkspaceBackend.set('remote-ssh://host/work', 'ws://127.0.0.1:45123', 'secret')

  expect(WorkspaceBackend.getWebSocketUrl('terminal-process')).toBe('')
})

test('rejects non-loopback endpoints', () => {
  expect(() => WorkspaceBackend.set('remote-ssh://host/work', 'ws://example.com:45123', 'secret')).toThrow(/loopback/)
})

test('bridges a message port to the remote backend', async () => {
  workspaceState.workspaceUri = 'remote-ssh://host/work'
  WorkspaceBackend.set('remote-ssh://host/work', 'ws://127.0.0.1:45123', 'secret')
  const webSocket: MockWebSocket = { send: jest.fn<(value: string) => void>() }
  create.mockResolvedValue(webSocket)
  const port = {
    close: jest.fn(),
    onmessage: undefined as undefined | ((event: { readonly data: unknown }) => void),
    postMessage: jest.fn(),
    start: jest.fn(),
  }

  await expect(WorkspaceBackend.connectMessagePort('terminal-process', port)).resolves.toBe(true)
  port.onmessage?.({ data: ['request'] })
  expect(webSocket.send).toHaveBeenCalledWith('["request"]')
  webSocket.onmessage?.({ data: '["response"]' })
  expect(port.postMessage).toHaveBeenCalledWith(['response'])
})
