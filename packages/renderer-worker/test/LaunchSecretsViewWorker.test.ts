import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'

jest.unstable_mockModule('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts', () => ({
  getConfiguredWorkerUrl: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/GetPortTuple/GetPortTuple.js', () => ({
  getPortTuple: jest
    .fn()
    .mockReturnValueOnce({ port1: 'bridge-worker-port', port2: 'bridge-host-port' })
    .mockReturnValueOnce({ port1: 'direct-worker-port', port2: 'direct-host-port' }),
}))

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
  handleIpc: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/HandleSecretsViewMessagePort/HandleSecretsViewMessagePort.ts', () => ({
  handleSecretsViewMessagePort: jest.fn(async () => undefined),
}))

jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => ({
  create: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
  invoke: jest.fn(async () => undefined),
  invokeAndTransfer: jest.fn(async () => undefined),
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: jest.fn(() => 2),
}))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invokeAndTransfer: jest.fn(async () => undefined),
}))

const GetConfiguredWorkerUrl = await import('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts')
const GetPortTuple = await import('../src/parts/GetPortTuple/GetPortTuple.js')
const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.js')
const HandleSecretsViewMessagePort = await import('../src/parts/HandleSecretsViewMessagePort/HandleSecretsViewMessagePort.ts')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const { launchSecretsViewWorker } = await import('../src/parts/LaunchSecretsViewWorker/LaunchSecretsViewWorker.ts')

beforeEach(() => {
  jest.clearAllMocks()
})

test('launches and connects the secrets view worker', async () => {
  const ipc = { send() {} }
  jest.mocked(GetConfiguredWorkerUrl.getConfiguredWorkerUrl).mockReturnValue('file:///secrets-view-worker.js')
  jest.mocked(IpcParent.create).mockResolvedValue(ipc as any)

  await expect(launchSecretsViewWorker()).resolves.toBe(ipc)

  expect(GetConfiguredWorkerUrl.getConfiguredWorkerUrl).toHaveBeenCalledWith(
    'develop.secretsViewPath',
    expect.stringContaining('/@lvce-editor/secrets-view/dist/secretsViewWorkerMain.js'),
  )
  expect(IpcParent.create).toHaveBeenCalledWith({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Secrets View Worker',
    url: 'file:///secrets-view-worker.js',
  })
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)
  expect(JsonRpc.invoke).toHaveBeenCalledWith(ipc, 'SecretsView.initialize', 2)
  expect(GetPortTuple.getPortTuple).toHaveBeenCalledTimes(2)
  expect(JsonRpc.invokeAndTransfer).toHaveBeenCalledWith(ipc, 'SecretsView.handleMessagePort', 'bridge-worker-port')
  expect(HandleSecretsViewMessagePort.handleSecretsViewMessagePort).toHaveBeenCalledWith('bridge-host-port' as any)
  expect(JsonRpc.invokeAndTransfer).toHaveBeenCalledWith(ipc, 'SecretsView.handleMessagePort', 'direct-worker-port', false)
  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledWith('HandleMessagePort.handleMessagePort', 'direct-host-port', 'SecretsView')
})
