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

const ExtensionNodeRpc = await import('../src/parts/ExtensionNodeRpc/ExtensionNodeRpc.js')
const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.js')
const Id = await import('../src/parts/Id/Id.js')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')

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
