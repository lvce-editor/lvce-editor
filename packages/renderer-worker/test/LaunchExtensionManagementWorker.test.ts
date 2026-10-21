import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

jest.unstable_mockModule('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts', () => ({
  getConfiguredWorkerUrl: jest.fn(() => 'https://example.com/extension-management-worker.js'),
}))

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
  handleIpc: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => ({
  create: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invoke: jest.fn(),
}))

const GetConfiguredWorkerUrl = await import('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts')
const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.js')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')
const LaunchExtensionManagementWorker = await import('../src/parts/LaunchExtensionManagementWorker/LaunchExtensionManagementWorker.js')
const Platform = await import('../src/parts/Platform/Platform.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')

beforeEach(() => {
  jest.resetAllMocks()
  jest.mocked(GetConfiguredWorkerUrl.getConfiguredWorkerUrl).mockReturnValue('https://example.com/extension-management-worker.js')
})

test('launchExtensionManagementWorker - launches web worker without shared process', async () => {
  const ipc = {}
  jest.mocked(Platform.getPlatform).mockReturnValue(PlatformType.Web)
  jest.mocked(IpcParent.create).mockResolvedValue(ipc)

  await expect(LaunchExtensionManagementWorker.launchExtensionManagementWorker()).resolves.toBe(ipc)

  expect(SharedProcess.invoke).not.toHaveBeenCalled()
  expect(GetConfiguredWorkerUrl.getConfiguredWorkerUrl).toHaveBeenCalledWith(
    'develop.extensionManagementWorkerPath',
    '/packages/renderer-worker/node_modules/@lvce-editor/extension-management-worker/dist/extensionManagementWorkerMain.js',
  )
  expect(IpcParent.create).toHaveBeenCalledWith({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    id: expect.any(Number),
    name: 'Extension Management Worker',
    parentName: 'Renderer Worker',
    url: 'https://example.com/extension-management-worker.js',
  })
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)
  expect(JsonRpc.invoke).toHaveBeenCalledWith(ipc, 'Extensions.initialize', PlatformType.Web, undefined)
})

test('launchExtensionManagementWorker - loads development config for remote worker', async () => {
  const ipc = {}
  const developmentConfig = { extensions: [], hotReload: true }
  jest.mocked(Platform.getPlatform).mockReturnValue(PlatformType.Remote)
  jest.mocked(SharedProcess.invoke).mockResolvedValue(developmentConfig)
  jest.mocked(IpcParent.create).mockResolvedValue(ipc)

  await expect(LaunchExtensionManagementWorker.launchExtensionManagementWorker()).resolves.toBe(ipc)

  expect(SharedProcess.invoke).toHaveBeenCalledWith('ExtensionManagement.getLinkedExtensionDevelopmentConfig')
  expect(JsonRpc.invoke).toHaveBeenCalledWith(ipc, 'Extensions.initialize', PlatformType.Remote, developmentConfig)
})


test('initializes the precreated extension worker through its transferred port', async () => {
  const IpcState = await import('../src/parts/IpcState/IpcState.js')
  const RuntimeConfig = await import('../src/parts/RuntimeConfig/RuntimeConfig.ts')
  const Transferrable = await import('../src/parts/Transferrable/Transferrable.js')
  const port = {}
  IpcState.setConfig(true)
  RuntimeConfig.initialize({ preloadWorkers: ['extensionManagementWorker'] })
  jest.mocked(Platform.getPlatform).mockReturnValue(PlatformType.Web)
  jest.mocked(IpcParent.create).mockImplementation(async ({ id }) => {
    Transferrable.transfer(id, port)
    return undefined
  })
  try {
    const ipc = await LaunchExtensionManagementWorker.launchExtensionManagementWorker()
    expect(ipc.port).toBe(port)
    expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)
    expect(JsonRpc.invoke).toHaveBeenCalledWith(ipc, 'Extensions.initialize', PlatformType.Web, undefined)
  } finally {
    IpcState.setConfig(false)
    RuntimeConfig.initialize()
  }
})
