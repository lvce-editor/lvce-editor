import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts', () => ({
  getConfiguredWorkerUrl: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
  handleIpc: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/GetPortTuple/GetPortTuple.js', () => ({
  getPortTuple: jest.fn(() => ({ port1: 'worker-port', port2: 'renderer-process-port' })),
}))

jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => ({
  create: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
  invoke: jest.fn(),
  invokeAndTransfer: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invokeAndTransfer: jest.fn(),
}))

const GetConfiguredWorkerUrl = await import('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts')
const GetPortTuple = await import('../src/parts/GetPortTuple/GetPortTuple.js')
const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.js')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')
const LaunchTextSearchViewWorker = await import('../src/parts/LaunchTextSearchViewWorker/LaunchTextSearchViewWorker.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')

test('launchTextSearchViewWorker', async () => {
  const ipc = { send() {} }
  // @ts-ignore
  GetConfiguredWorkerUrl.getConfiguredWorkerUrl.mockReturnValue('file:///text-search-view-worker.js')
  // @ts-ignore
  GetPortTuple.getPortTuple.mockReturnValue({ port1: 'worker-port', port2: 'renderer-process-port' })
  // @ts-ignore
  IpcParent.create.mockResolvedValue(ipc)

  await expect(LaunchTextSearchViewWorker.launchTextSearchViewWorker()).resolves.toBe(ipc)

  expect(GetConfiguredWorkerUrl.getConfiguredWorkerUrl).toHaveBeenCalledWith(
    'develop.textSearchViewPath',
    expect.stringContaining('/@lvce-editor/text-search-view/dist/textSearchViewMain.js'),
  )
  expect(IpcParent.create).toHaveBeenCalledWith({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Text Search View Worker',
    url: 'file:///text-search-view-worker.js',
  })
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)
  expect(JsonRpc.invoke).not.toHaveBeenCalled()
  expect(JsonRpc.invokeAndTransfer).toHaveBeenCalledWith(ipc, 'TextSearch.handleMessagePort', 'worker-port')
  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledWith('HandleMessagePort.handleMessagePort', 'renderer-process-port', 'TextSearch')
})
