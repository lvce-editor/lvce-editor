import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts', () => {
  return {
    getConfiguredWorkerUrl: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => {
  return {
    handleIpc: jest.fn(() => {
      throw new Error('not implemented')
    }),
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
const LaunchDiffWorker = await import('../src/parts/LaunchDiffWorker/LaunchDiffWorker.js')

test('launchDiffWorker', async () => {
  const ipc = {
    send() {},
  }
  // @ts-ignore
  GetConfiguredWorkerUrl.getConfiguredWorkerUrl.mockReturnValue('file:///diff-worker.js')
  // @ts-ignore
  IpcParent.create.mockResolvedValue(ipc)
  // @ts-ignore
  HandleIpc.handleIpc.mockReturnValue(undefined)

  const result = await LaunchDiffWorker.launchDiffWorker()

  expect(GetConfiguredWorkerUrl.getConfiguredWorkerUrl).toHaveBeenCalledTimes(1)
  expect(GetConfiguredWorkerUrl.getConfiguredWorkerUrl).toHaveBeenCalledWith(
    'develop.diffWorkerPath',
    expect.stringContaining('/@lvce-editor/diff-worker/dist/diffWorkerMain.js'),
  )
  expect(IpcParent.create).toHaveBeenCalledTimes(1)
  expect(IpcParent.create).toHaveBeenCalledWith({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Diff Worker',
    url: 'file:///diff-worker.js',
  })
  expect(HandleIpc.handleIpc).toHaveBeenCalledTimes(1)
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)
  expect(result).toBe(ipc)
})
