import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invokeAndTransfer: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/WebSocketCapability/WebSocketCapability.js', () => ({
  create: jest.fn(),
}))

const ExtensionNodeRpc = await import('../src/parts/ExtensionNodeRpc/ExtensionNodeRpc.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const WebSocketCapability = await import('../src/parts/WebSocketCapability/WebSocketCapability.js')

test('createConnection returns an authenticated remote node process URL', async () => {
  // @ts-ignore
  WebSocketCapability.create.mockResolvedValue({
    protocols: [],
    url: 'ws://127.0.0.1:3000/websocket/extension-node-process?token=test-token',
  })

  await expect(ExtensionNodeRpc.createConnection('builtin.git', 'git-client')).resolves.toEqual({
    protocols: [],
    url: 'ws://127.0.0.1:3000/websocket/extension-node-process?token=test-token&extensionId=builtin.git&rpcId=git-client',
  })
  expect(WebSocketCapability.create).toHaveBeenCalledWith('extension-node-process')
})

test('createConnection returns a current-server node process URL without a workspace connection', async () => {
  // @ts-ignore
  WebSocketCapability.create.mockResolvedValue({
    protocols: [],
    url: 'ws://localhost:3000/websocket/extension-node-process',
  })

  await expect(ExtensionNodeRpc.createConnection('builtin.git', 'git-client')).resolves.toEqual({
    protocols: [],
    url: 'ws://localhost:3000/websocket/extension-node-process?extensionId=builtin.git&rpcId=git-client',
  })
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
