import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => {
  return {
    handleIpc: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Id/Id.js', () => {
  return {
    create: jest.fn(() => 42),
  }
})

jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => {
  return {
    create: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => {
  return {
    invokeAndTransfer: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getPlatform: jest.fn(() => PlatformType.Web),
  }
})

const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.js')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')
const LaunchIsolatedExtensionHostWorker = await import('../src/parts/LaunchIsolatedExtensionHostWorker/LaunchIsolatedExtensionHostWorker.js')

test('launchIsolatedExtensionHostWorker', async () => {
  const port = {}
  const ipc = {
    send() {},
  }
  // @ts-ignore
  IpcParent.create.mockResolvedValue(ipc)
  // @ts-ignore
  HandleIpc.handleIpc.mockReturnValue(undefined)
  // @ts-ignore
  JsonRpc.invokeAndTransfer.mockResolvedValue(undefined)

  await LaunchIsolatedExtensionHostWorker.launchIsolatedExtensionHostWorker(port, 'sample.extension', '/remote/sample/main.js')

  expect(IpcParent.create).toHaveBeenCalledTimes(1)
  expect(IpcParent.create).toHaveBeenCalledWith(
    expect.objectContaining({
      method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
      name: 'Extension API: sample.extension',
      url: '/remote/sample/main.js',
    }),
  )
  expect(HandleIpc.handleIpc).toHaveBeenCalledTimes(1)
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)
  expect(JsonRpc.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(JsonRpc.invokeAndTransfer).toHaveBeenCalledWith(ipc, 'HandleMessagePort.handleExtensionManagementMessagePort', port)
})
