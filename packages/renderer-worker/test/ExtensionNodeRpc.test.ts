import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
  handleIpc: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Id/Id.js', () => ({
  create: jest.fn(() => 42),
}))

jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => ({
  create: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invokeAndTransfer: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/WorkspaceBackend/WorkspaceBackend.js', () => ({
  getWebSocketUrl: jest.fn(),
}))

const ExtensionNodeRpc = await import('../src/parts/ExtensionNodeRpc/ExtensionNodeRpc.js')
const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.js')
const Id = await import('../src/parts/Id/Id.js')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const WorkspaceBackend = await import('../src/parts/WorkspaceBackend/WorkspaceBackend.js')

test('createConnection returns an authenticated remote node process URL', async () => {
  // @ts-ignore
  WorkspaceBackend.getWebSocketUrl.mockReturnValue('ws://127.0.0.1:3000/websocket/extension-node-process?token=test-token')

  await expect(ExtensionNodeRpc.createConnection('builtin.git', 'git-client')).resolves.toEqual({
    protocols: [],
    url: 'ws://127.0.0.1:3000/websocket/extension-node-process?token=test-token&extensionId=builtin.git&rpcId=git-client',
  })
})

test('createConnection rejects when no remote workspace backend is active', async () => {
  // @ts-ignore
  WorkspaceBackend.getWebSocketUrl.mockReturnValue('')

  await expect(ExtensionNodeRpc.createConnection('builtin.git', 'git-client')).rejects.toThrow(
    'ExtensionNodeRpc.createConnection command not found without a remote workspace backend',
  )
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

test('create, invoke, and dispose', async () => {
  const rpc = {
    dispose: jest.fn(),
  }
  // @ts-ignore
  Id.create.mockReturnValue(42)
  // @ts-ignore
  IpcParent.create.mockResolvedValue(rpc)
  // @ts-ignore
  JsonRpc.invoke.mockResolvedValueOnce(undefined).mockResolvedValueOnce('result')

  const id = await ExtensionNodeRpc.create('Git Worker', '/test/gitWorkerMain.js')

  expect(id).toBe(42)
  expect(IpcParent.create).toHaveBeenCalledWith({
    initialCommand: 'HandleMessagePortForExtensionHostHelperProcess.handleMessagePortForExtensionHostHelperProcess',
    method: IpcParentType.NodeAlternate,
    name: 'Git Worker',
    type: 'extension-host-helper-process',
  })
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(rpc)
  expect(JsonRpc.invoke).toHaveBeenCalledWith(rpc, 'LoadFile.loadFile', '/test/gitWorkerMain.js')

  await expect(ExtensionNodeRpc.invoke(id, 'Git.status', '/test')).resolves.toBe('result')
  expect(JsonRpc.invoke).toHaveBeenLastCalledWith(rpc, 'Git.status', '/test')

  ExtensionNodeRpc.dispose(id)
  expect(rpc.dispose).toHaveBeenCalledTimes(1)
  await expect(ExtensionNodeRpc.invoke(id, 'Git.status')).rejects.toThrow(new Error('node rpc 42 not found'))
})
