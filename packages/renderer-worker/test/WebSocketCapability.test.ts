/* eslint-disable jest/no-restricted-jest-methods -- Module boundary tests require ESM dependency mocks. */
import { expect, jest, test } from '@jest/globals'

const getWebSocketUrl = jest.fn<(_type: string) => Promise<string>>(async () => 'ws://remote.example/process')
const isActive = jest.fn(() => true)

jest.unstable_mockModule('../src/parts/WorkspaceConnection/WorkspaceConnection.js', () => ({
  getWebSocketUrl,
  isActive,
}))

jest.unstable_mockModule('../src/parts/GetWebSocketUrl/GetWebSocketUrl.js', () => ({
  getWebSocketUrl: (type: string) => `ws://local/websocket/${type}`,
}))
jest.unstable_mockModule('../src/parts/Location/Location.js', () => ({ getHost: () => 'local' }))

const extensionInvoke = jest.fn(async () => '')
jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({ invoke: extensionInvoke }))

const WebSocketCapability = await import('../src/parts/WebSocketCapability/WebSocketCapability.js')

test('isActive returns workspace connection state', () => {
  expect(WebSocketCapability.isActive()).toBe(true)
  expect(isActive).toHaveBeenCalledTimes(1)
})

test.each(['shared-process', 'file-system-process', 'process-explorer', 'extension-node-process'])('keeps %s on the local host', async (type) => {
  getWebSocketUrl.mockClear()
  await expect(WebSocketCapability.create(type)).resolves.toEqual({ protocols: [], url: `ws://local/websocket/${type}` })
  expect(getWebSocketUrl).not.toHaveBeenCalled()
})

test('terminals can use a workspace transport WebSocket', async () => {
  await expect(WebSocketCapability.create('terminal-process')).resolves.toEqual({ protocols: [], url: 'ws://remote.example/process' })
})

test('workspace extensions can own terminal WebSockets in browser hosts', async () => {
  extensionInvoke.mockResolvedValueOnce('remote-ssh://host/work')
  await expect(WebSocketCapability.create('terminal-process')).resolves.toEqual({ type: 'message-port' })
})
