import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.ts'

const dispose = jest.fn()
const ipc = { dispose }

jest.unstable_mockModule('../src/parts/ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js', () => ({
  create: jest.fn(async () => ipc),
}))

jest.unstable_mockModule('../src/parts/HandleIncomingIpc/HandleIncomingIpc.js', () => ({
  handleIncomingIpc: jest.fn(async () => 'generic'),
}))

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
  handleIpc: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
  invoke: jest.fn(async () => undefined),
  invokeAndTransfer: jest.fn(async () => undefined),
}))

jest.unstable_mockModule('../src/parts/ResolveExtensionNodeRpcPath/ResolveExtensionNodeRpcPath.js', () => ({
  resolveExtensionNodeRpcPath: jest.fn(async () => '/remote/extensions/builtin.git/node/src/gitClient.js'),
}))

const ExtensionHostHelperProcessIpc = await import('../src/parts/ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js')
const HandleIncomingIpc = await import('../src/parts/HandleIncomingIpc/HandleIncomingIpc.js')
const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.js')
const HandleWebSocket = await import('../src/parts/HandleWebSocketForExtensionHostHelperProcess/HandleWebSocketForExtensionHostHelperProcess.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')
const ResolveExtensionNodeRpcPath = await import('../src/parts/ResolveExtensionNodeRpcPath/ResolveExtensionNodeRpcPath.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('uses the generic helper process for an unscoped websocket', async () => {
  const message = { url: '/websocket/extension-host-helper-process' }
  const handle = {}

  await expect(HandleWebSocket.handleWebSocket(message, handle)).resolves.toBe('generic')

  expect(HandleIncomingIpc.handleIncomingIpc).toHaveBeenCalledWith(3, handle, message)
  expect(ResolveExtensionNodeRpcPath.resolveExtensionNodeRpcPath).not.toHaveBeenCalled()
})

test('preloads a declared remote extension node rpc', async () => {
  const message = {
    url: '/websocket/extension-host-helper-process?extensionId=builtin.git&rpcId=git-client',
  }
  const handle = {}

  await HandleWebSocket.handleWebSocket(message, handle)

  expect(ResolveExtensionNodeRpcPath.resolveExtensionNodeRpcPath).toHaveBeenCalledWith('builtin.git', 'git-client')
  expect(ExtensionHostHelperProcessIpc.create).toHaveBeenCalledWith({ method: IpcParentType.NodeForkedProcess })
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)
  expect(JsonRpc.invoke).toHaveBeenCalledWith(ipc, 'LoadFile.loadFile', '/remote/extensions/builtin.git/node/src/gitClient.js')
  expect(JsonRpc.invokeAndTransfer).toHaveBeenCalledWith(ipc, 'HandleWebSocket.handleWebSocket', handle, message)
})

test('rejects an incomplete remote extension node rpc request', async () => {
  await expect(HandleWebSocket.handleWebSocket({ url: '/websocket/extension-host-helper-process?extensionId=builtin.git' }, {})).rejects.toThrow(
    'Remote extension node rpc request is incomplete',
  )
})

test('disposes the helper process when preloading fails', async () => {
  // @ts-ignore
  JsonRpc.invoke.mockRejectedValueOnce(new Error('load failed'))

  await expect(
    HandleWebSocket.handleWebSocket({ url: '/websocket/extension-host-helper-process?extensionId=builtin.git&rpcId=git-client' }, {}),
  ).rejects.toThrow('load failed')

  expect(dispose).toHaveBeenCalledTimes(1)
})
