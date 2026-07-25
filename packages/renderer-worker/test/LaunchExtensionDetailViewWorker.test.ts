/* eslint-disable jest/no-restricted-jest-methods -- Worker launch tests use ESM module mocks for transport dependencies. */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'

jest.unstable_mockModule('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts', () => {
  return {
    getConfiguredWorkerUrl: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => {
  return {
    handleIpc: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => {
  return {
    create: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const GetConfiguredWorkerUrl = await import('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts')
const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.js')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')
const LaunchExtensionDetailViewWorker = await import('../src/parts/LaunchExtensionDetailViewWorker/LaunchExtensionDetailViewWorker.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('launches the extension detail view worker', async () => {
  const ipc = {
    send(): void {},
  }
  // @ts-ignore
  GetConfiguredWorkerUrl.getConfiguredWorkerUrl.mockReturnValue('file:///extension-detail-view-worker.js')
  // @ts-ignore
  IpcParent.create.mockResolvedValue(ipc)
  const result = await LaunchExtensionDetailViewWorker.launchExtensionDetailViewWorker()

  expect(IpcParent.create).toHaveBeenCalledWith({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Extension Detail View Worker',
    url: 'file:///extension-detail-view-worker.js',
  })
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)
  expect(result).toBe(ipc)
})
