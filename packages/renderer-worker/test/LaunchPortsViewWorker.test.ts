import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'

jest.unstable_mockModule('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts', () => ({
  getConfiguredWorkerUrl: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
  handleIpc: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => ({
  create: jest.fn(),
}))

const GetConfiguredWorkerUrl = await import('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts')
const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.js')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')
const { launchPortsViewWorker } = await import('../src/parts/LaunchPortsViewWorker/LaunchPortsViewWorker.ts')

beforeEach(() => {
  jest.clearAllMocks()
})

test('launches the ports view worker', async () => {
  const ipc = { send() {} }
  jest.mocked(GetConfiguredWorkerUrl.getConfiguredWorkerUrl).mockReturnValue('file:///ports-view-worker.js')
  jest.mocked(IpcParent.create).mockResolvedValue(ipc as any)

  await expect(launchPortsViewWorker()).resolves.toBe(ipc)

  expect(GetConfiguredWorkerUrl.getConfiguredWorkerUrl).toHaveBeenCalledWith(
    'develop.portsViewPath',
    expect.stringContaining('/@lvce-editor/ports-view/dist/portsViewWorkerMain.js'),
  )
  expect(IpcParent.create).toHaveBeenCalledWith({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Ports View Worker',
    url: 'file:///ports-view-worker.js',
  })
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)
})
