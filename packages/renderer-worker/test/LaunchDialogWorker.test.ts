/* eslint-disable jest/no-restricted-jest-methods -- Worker launch tests use ESM module mocks for transport dependencies. */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

jest.unstable_mockModule('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts', () => ({
  getConfiguredWorkerUrl: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
  handleIpc: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => ({
  create: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: jest.fn(),
}))

const GetConfiguredWorkerUrl = await import('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts')
const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.js')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')
const LaunchDialogWorker = await import('../src/parts/LaunchDialogWorker/LaunchDialogWorker.js')
const Platform = await import('../src/parts/Platform/Platform.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('launchDialogWorker - launches Electron worker', async () => {
  const ipc = {}
  // @ts-ignore
  GetConfiguredWorkerUrl.getConfiguredWorkerUrl.mockReturnValue('file:///dialog-worker.js')
  // @ts-ignore
  IpcParent.create.mockResolvedValue(ipc)
  // @ts-ignore
  Platform.getPlatform.mockReturnValue(PlatformType.Electron)

  await expect(LaunchDialogWorker.launchDialogWorker()).resolves.toBe(ipc)

  expect(GetConfiguredWorkerUrl.getConfiguredWorkerUrl).toHaveBeenCalledWith(
    'develop.dialogWorkerPath',
    '/packages/renderer-worker/node_modules/@lvce-editor/dialog-worker/dist/dialogWorkerMain.js',
  )
  expect(IpcParent.create).toHaveBeenCalledWith({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Dialog Worker (Electron)',
    url: 'file:///dialog-worker.js',
  })
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)
})

test('launchDialogWorker - launches web worker', async () => {
  const ipc = {}
  // @ts-ignore
  GetConfiguredWorkerUrl.getConfiguredWorkerUrl.mockReturnValue('https://example.com/dialog-worker.js')
  // @ts-ignore
  IpcParent.create.mockResolvedValue(ipc)
  // @ts-ignore
  Platform.getPlatform.mockReturnValue(PlatformType.Web)

  await expect(LaunchDialogWorker.launchDialogWorker()).resolves.toBe(ipc)

  expect(IpcParent.create).toHaveBeenCalledWith({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Dialog Worker (Web)',
    url: 'https://example.com/dialog-worker.js',
  })
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)
})
