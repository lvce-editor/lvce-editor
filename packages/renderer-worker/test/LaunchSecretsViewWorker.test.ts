import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'

jest.unstable_mockModule('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts', () => ({
  getConfiguredWorkerUrl: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/GetPortTuple/GetPortTuple.js', () => ({
  getPortTuple: jest.fn(() => ({ port1: 'worker-port', port2: 'host-port' })),
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
  invokeAndTransfer: jest.fn(async () => undefined),
}))

const GetConfiguredWorkerUrl = await import('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts')
const GetPortTuple = await import('../src/parts/GetPortTuple/GetPortTuple.js')
const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.js')
const HandleSecretsViewMessagePort = await import('../src/parts/HandleSecretsViewMessagePort/HandleSecretsViewMessagePort.ts')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')
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
  expect(GetPortTuple.getPortTuple).toHaveBeenCalledTimes(1)
  expect(JsonRpc.invokeAndTransfer).toHaveBeenCalledWith(ipc, 'SecretsView.handleMessagePort', 'worker-port')
  expect(HandleSecretsViewMessagePort.handleSecretsViewMessagePort).toHaveBeenCalledWith('host-port' as any)
})
