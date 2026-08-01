import { beforeEach, expect, jest, test } from '@jest/globals'

const webSocket = { close: jest.fn() }
const ipc = {}
const createWebSocket = jest.fn((_url: string, _protocols: readonly string[], _factory: () => Promise<unknown>) => webSocket)
const invokeJsonRpc = jest.fn(async (..._args: readonly unknown[]) => 'result')
const sharedProcessInvoke = jest.fn(async (_method: string, _path: string) => ({
  protocols: ['lvce-rpc', 'lvce-capability.token'],
  url: '/websocket/capability',
}))

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
  handleIpc: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Id/Id.js', () => ({
  create: jest.fn(() => 42),
}))

jest.unstable_mockModule('../src/parts/IpcParentWithWebSocket/IpcParentWithWebSocket.js', () => ({
  wrap: jest.fn(() => ipc),
}))

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
  invoke: invokeJsonRpc,
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: jest.fn(() => 3),
}))

jest.unstable_mockModule('../src/parts/ReconnectingWebSocket/ReconnectingWebSocket.js', () => ({
  create: createWebSocket,
}))

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invoke: sharedProcessInvoke,
  invokeAndTransfer: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/WaitForWebSocketToBeOpen/WaitForWebSocketToBeOpen.js', () => ({
  waitForWebSocketToBeOpen: jest.fn(async () => ({ type: 1 })),
}))

jest.unstable_mockModule('../src/parts/WebSocketCapability/WebSocketCapability.js', () => ({
  resolveConnectionInfo: jest.fn((value: { readonly protocols: readonly string[]; readonly url: string }) => ({
    ...value,
    url: 'ws://localhost/websocket/capability',
  })),
}))

const ExtensionNodeRpc = await import('../src/parts/ExtensionNodeRpc/ExtensionNodeRpc.js')
const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('keeps trusted path-based rpc on a preloaded capability connection', async () => {
  const id = await ExtensionNodeRpc.create('Git Worker', '/test/gitWorkerMain.js')

  expect(id).toBe(42)
  expect(sharedProcessInvoke).toHaveBeenCalledWith('WebSocketCapability.createLegacyExtensionNodeRpc', '/test/gitWorkerMain.js')
  expect(createWebSocket).toHaveBeenCalledWith(
    'ws://localhost/websocket/capability',
    ['lvce-rpc', 'lvce-capability.token'],
    expect.any(Function),
  )
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)

  await expect(ExtensionNodeRpc.invoke(id, 'Git.status', '/test')).resolves.toBe('result')
  expect(invokeJsonRpc).toHaveBeenCalledWith(ipc, 'Git.status', '/test')

  ExtensionNodeRpc.dispose(id)
  expect(webSocket.close).toHaveBeenCalledTimes(1)
  await expect(ExtensionNodeRpc.invoke(id, 'Git.status')).rejects.toThrow(new Error('node rpc 42 not found'))
})
