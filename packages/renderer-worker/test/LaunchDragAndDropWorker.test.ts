/* eslint-disable jest/no-restricted-jest-methods -- Worker launch tests use ESM module mocks for transport dependencies. */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcParentType from '../src/parts/IpcParentType/IpcParentType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

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
const LaunchDragAndDropWorker = await import('../src/parts/LaunchDragAndDropWorker/LaunchDragAndDropWorker.js')

test('launchDragAndDropWorker', async () => {
  const ipc = { send(): void {} }
  // @ts-ignore
  GetConfiguredWorkerUrl.getConfiguredWorkerUrl.mockReturnValue('file:///drag-and-drop-worker.js')
  // @ts-ignore
  IpcParent.create.mockResolvedValue(ipc)

  const result = await LaunchDragAndDropWorker.launchDragAndDropWorker()

  expect(GetConfiguredWorkerUrl.getConfiguredWorkerUrl).toHaveBeenCalledWith(
    'develop.dragAndDropWorkerPath',
    expect.stringContaining('/@lvce-editor/drag-and-drop-worker/dist/dragAndDropWorkerMain.js'),
  )
  expect(IpcParent.create).toHaveBeenCalledWith({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Drag And Drop Worker',
    url: 'file:///drag-and-drop-worker.js',
  })
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)
  expect(result).toBe(ipc)
})
