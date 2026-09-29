import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'

const ipc = { dispose: jest.fn() }

jest.unstable_mockModule('../src/parts/ExtensionNodeProcessIpc/ExtensionNodeProcessIpc.js', () => ({
  create: jest.fn(async () => ipc),
}))

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
  invokeAndTransfer: jest.fn(),
}))

const ExtensionNodeProcessIpc = await import('../src/parts/ExtensionNodeProcessIpc/ExtensionNodeProcessIpc.js')
const HandleWebSocketForExtensionNodeProcess =
  await import('../src/parts/HandleWebSocketForExtensionNodeProcess/HandleWebSocketForExtensionNodeProcess.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')

beforeEach(() => {
  jest.resetAllMocks()
  jest.mocked(ExtensionNodeProcessIpc.create).mockResolvedValue(ipc)
  jest.mocked(JsonRpc.invokeAndTransfer).mockResolvedValue(undefined)
})

test('launches the declared process and transfers the authenticated remote WebSocket', async () => {
  const message = { url: '/websocket/extension-node-process?token=test&extensionId=builtin.git&rpcId=git-client' }
  const handle = {}

  await HandleWebSocketForExtensionNodeProcess.handleWebSocket(message, handle)

  expect(ExtensionNodeProcessIpc.create).toHaveBeenCalledWith({
    extensionId: 'builtin.git',
    method: IpcParentType.NodeForkedProcess,
    rpcId: 'git-client',
  })
  expect(JsonRpc.invokeAndTransfer).toHaveBeenCalledWith(ipc, 'NodeRpcProcess.handleWebSocket', handle, message)
})

test('rejects incomplete requests before launching a process', async () => {
  await expect(
    HandleWebSocketForExtensionNodeProcess.handleWebSocket({ url: '/websocket/extension-node-process?extensionId=builtin.git' }, {}),
  ).rejects.toThrow('request is incomplete')
  expect(ExtensionNodeProcessIpc.create).not.toHaveBeenCalled()
})

test('disposes the process when WebSocket attachment fails', async () => {
  jest.mocked(JsonRpc.invokeAndTransfer).mockRejectedValue(new Error('attach failed'))

  await expect(
    HandleWebSocketForExtensionNodeProcess.handleWebSocket({ url: '/websocket/extension-node-process?extensionId=builtin.git&rpcId=git-client' }, {}),
  ).rejects.toThrow('attach failed')
  expect(ipc.dispose).toHaveBeenCalledTimes(1)
})
