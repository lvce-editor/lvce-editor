import { beforeEach, expect, jest, test } from '@jest/globals'

interface MockWebSocket {
  onclose?: () => void
  onmessage?: (event: { readonly data: string }) => void
  readonly send: (value: string) => void
}

const create = jest.fn<(options: { readonly getUrl: () => Promise<string>; readonly type: string }) => Promise<MockWebSocket>>()
const workspaceState = { workspaceUri: '' }

jest.unstable_mockModule('../src/parts/WorkspaceState/WorkspaceState.js', () => ({ state: workspaceState }))
jest.unstable_mockModule('../src/parts/IpcParentWithWebSocket/IpcParentWithWebSocket.js', () => ({ create }))

const WorkspaceBackend = await import('../src/parts/WorkspaceBackend/WorkspaceBackend.js')

beforeEach(() => {
  WorkspaceBackend.reset()
  workspaceState.workspaceUri = ''
  create.mockReset()
})

test('returns an authenticated WebSocket URL for the matching workspace', async () => {
  workspaceState.workspaceUri = 'remote-ssh://host/work'
  WorkspaceBackend.set('remote-ssh://host/work', 'ws://127.0.0.1:45123', 'secret')

  await expect(WorkspaceBackend.getWebSocketUrl('terminal-process')).resolves.toBe('ws://127.0.0.1:45123/websocket/terminal-process?token=secret')
  expect(WorkspaceBackend.isActive()).toBe(true)
})

test('does not affect a different workspace', async () => {
  workspaceState.workspaceUri = 'file:///tmp/work'
  WorkspaceBackend.set('remote-ssh://host/work', 'ws://127.0.0.1:45123', 'secret')

  await expect(WorkspaceBackend.getWebSocketUrl('terminal-process')).resolves.toBe('')
  expect(WorkspaceBackend.isActive()).toBe(false)
})

test('rejects non-loopback endpoints', () => {
  expect(() => WorkspaceBackend.set('remote-ssh://host/work', 'ws://example.com:45123', 'secret')).toThrow(/loopback/)
})

test('exchanges a bearer session for a secure WebSocket ticket', async () => {
  workspaceState.workspaceUri = 'file:///work'
  WorkspaceBackend.set('file:///work', 'wss://remote.example.com', 'session-secret', 'websocket-ticket')
  const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
    json: async () => ({ ticket: 'short-lived-ticket' }),
    ok: true,
  } as Response)

  await expect(WorkspaceBackend.getWebSocketUrl('terminal-process')).resolves.toBe(
    'wss://remote.example.com/websocket/terminal-process?ticket=short-lived-ticket',
  )
  expect(fetchSpy).toHaveBeenCalledWith(new URL('https://remote.example.com/auth/websocket-ticket'), {
    headers: { authorization: 'Bearer session-secret' },
    method: 'POST',
  })
  fetchSpy.mockRestore()
})

test('uses HTTP only for an authenticated loopback WebSocket', async () => {
  workspaceState.workspaceUri = 'file:///work'
  WorkspaceBackend.set('file:///work', 'ws://127.0.0.1:3774', 'session-secret', 'websocket-ticket')
  const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
    json: async () => ({ ticket: 'short-lived-ticket' }),
    ok: true,
  } as Response)

  await expect(WorkspaceBackend.getWebSocketUrl('terminal-process')).resolves.toBe(
    'ws://127.0.0.1:3774/websocket/terminal-process?ticket=short-lived-ticket',
  )
  expect(fetchSpy).toHaveBeenCalledWith(new URL('http://127.0.0.1:3774/auth/websocket-ticket'), {
    headers: { authorization: 'Bearer session-secret' },
    method: 'POST',
  })
  fetchSpy.mockRestore()
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
  expect(create).toHaveBeenCalledWith({ getUrl: expect.any(Function), type: 'terminal-process' })
  port.onmessage?.({ data: ['request'] })
  expect(webSocket.send).toHaveBeenCalledWith('["request"]')
  webSocket.onmessage?.({ data: '["response"]' })
  expect(port.postMessage).toHaveBeenCalledWith(['response'])
})
