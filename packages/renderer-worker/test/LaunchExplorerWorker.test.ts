/* eslint-disable jest/no-restricted-jest-methods -- Worker launch tests use ESM module mocks for transport dependencies. */
import { expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'

jest.unstable_mockModule('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts', () => ({
  getConfiguredWorkerUrl: jest.fn(() => 'file:///explorer-worker.js'),
}))
jest.unstable_mockModule('../src/parts/GetPortTuple/GetPortTuple.js', () => ({
  getPortTuple: jest.fn(() => ({ port1: 'explorer-port', port2: 'renderer-process-port' })),
}))
jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
  handleIpc: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => ({
  create: jest.fn(async (): Promise<{ send: () => void }> => ({ send(): void {} })),
}))
jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
  invoke: jest.fn(async () => undefined),
  invokeAndTransfer: jest.fn(async () => undefined),
}))
jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invokeAndTransfer: jest.fn(async () => undefined),
}))

const GetPortTuple = await import('../src/parts/GetPortTuple/GetPortTuple.js')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const LaunchExplorerWorker = await import('../src/parts/LaunchExplorerWorker/LaunchExplorerWorker.ts')

test('launchExplorerWorker connects the explorer worker directly to the renderer process', async () => {
  const ipc = await LaunchExplorerWorker.launchExplorerWorker()

  expect(IpcParent.create).toHaveBeenCalledWith({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Explorer Worker',
    url: 'file:///explorer-worker.js',
  })
  expect(JsonRpc.invoke).toHaveBeenCalledWith(ipc, 'Explorer.initialize')
  expect(GetPortTuple.getPortTuple).toHaveBeenCalledTimes(1)
  expect(JsonRpc.invokeAndTransfer).toHaveBeenCalledWith(ipc, 'Explorer.handleMessagePort', 'explorer-port')
  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledWith('HandleMessagePort.handleMessagePort', 'renderer-process-port')
})
