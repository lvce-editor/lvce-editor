import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/GetWebSocketUrl/GetWebSocketUrl.js', () => ({
  getWebSocketUrl: () => 'ws://localhost:3000/websocket/extension-node-process',
}))

jest.unstable_mockModule('../src/parts/Location/Location.js', () => ({
  getHost: () => 'localhost:3000',
}))

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invokeAndTransfer: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/WebSocketCapability/WebSocketCapability.js', () => ({
  create: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/WorkspaceConnection/WorkspaceConnection.js', () => ({
  connectMessagePort: jest.fn(async () => false),
}))

const ExtensionNodeRpc = await import('../src/parts/ExtensionNodeRpc/ExtensionNodeRpc.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const WebSocketCapability = await import('../src/parts/WebSocketCapability/WebSocketCapability.js')
const WorkspaceConnection = await import('../src/parts/WorkspaceConnection/WorkspaceConnection.js')

test.each(['builtin.git', 'builtin.remote-ssh', 'custom.extension'])('creates local Node process URLs for %s', async (extensionId) => {
  await expect(ExtensionNodeRpc.createConnection(extensionId, 'client')).resolves.toEqual({
    protocols: [],
    url: `ws://localhost:3000/websocket/extension-node-process?extensionId=${extensionId}&rpcId=client`,
  })
  expect(WebSocketCapability.create).not.toHaveBeenCalled()
})

test('supports direct Electron connections', () => {
  expect(ExtensionNodeRpc.supportsDirectConnection()).toBe(true)
})

test('transfers an extension-bound message port to the shared process', async () => {
  const { port1, port2 } = new MessageChannel()

  await ExtensionNodeRpc.createMessagePort(port1, 'builtin.git', 'git-client')

  expect(SharedProcess.invokeAndTransfer).toHaveBeenCalledWith(
    'HandleMessagePortForExtensionNodeProcess.handleMessagePortForExtensionNodeProcess',
    port1,
    'builtin.git',
    'git-client',
  )
  port1.close()
  port2.close()
})

test.each(['builtin.git', 'builtin.remote-ssh', 'custom.extension'])(
  'transfers %s ports locally without interpreting workspace transport',
  async (extensionId) => {
    const { port1, port2 } = new MessageChannel()
    jest.mocked(WorkspaceConnection.connectMessagePort).mockResolvedValueOnce(true)
    try {
      await ExtensionNodeRpc.createMessagePort(port1, extensionId, 'client')
      expect(WorkspaceConnection.connectMessagePort).not.toHaveBeenCalled()
      expect(SharedProcess.invokeAndTransfer).toHaveBeenCalledWith(
        'HandleMessagePortForExtensionNodeProcess.handleMessagePortForExtensionNodeProcess',
        port1,
        extensionId,
        'client',
      )
    } finally {
      port1.close()
      port2.close()
    }
  },
)
