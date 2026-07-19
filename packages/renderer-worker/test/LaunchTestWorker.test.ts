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

jest.unstable_mockModule('../src/parts/TestWorker/TestWorker.js', () => {
  return {
    set: jest.fn(),
  }
})

const GetConfiguredWorkerUrl = await import('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts')
const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.js')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.js')
const LaunchTestWorker = await import('../src/parts/LaunchTestWorker/LaunchTestWorker.ts')
const TestWorker = await import('../src/parts/TestWorker/TestWorker.js')

beforeEach(() => {
  jest.resetAllMocks()
  LaunchTestWorker.reset()
})

test('preload starts the configured Test Worker once and execution reuses it', async () => {
  const ipc = {
    send() {},
  }
  let resolveWorker: (value: typeof ipc) => void = () => {}
  const workerPromise = new Promise<typeof ipc>((resolve) => {
    resolveWorker = resolve
  })
  // @ts-ignore
  GetConfiguredWorkerUrl.getConfiguredWorkerUrl.mockReturnValue('file:///configured-test-worker.js')
  // @ts-ignore
  IpcParent.create.mockReturnValue(workerPromise)

  LaunchTestWorker.preloadTestWorker('http://localhost:3000/tests/activity-bar.html', false)
  LaunchTestWorker.preloadTestWorker('http://localhost:3000/tests/activity-bar.html', false)
  const executionPromise = LaunchTestWorker.launchTestWorker()

  expect(GetConfiguredWorkerUrl.getConfiguredWorkerUrl).toHaveBeenCalledTimes(1)
  expect(GetConfiguredWorkerUrl.getConfiguredWorkerUrl).toHaveBeenCalledWith(
    'develop.testWorkerPath',
    expect.stringContaining('/@lvce-editor/test-worker/dist/testWorkerMain.js'),
  )
  expect(IpcParent.create).toHaveBeenCalledTimes(1)
  expect(IpcParent.create).toHaveBeenCalledWith({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Test Worker',
    url: 'file:///configured-test-worker.js',
  })

  resolveWorker(ipc)
  await expect(executionPromise).resolves.toBe(ipc)
  await expect(LaunchTestWorker.launchTestWorker()).resolves.toBe(ipc)
  expect(IpcParent.create).toHaveBeenCalledTimes(1)
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)
  expect(TestWorker.set).toHaveBeenCalledWith(ipc)
})

test.each([
  ['normal workspace', 'http://localhost:3000/github/lvce-editor/lvce-editor', false],
  ['prompt mode', 'http://localhost:3000/tests/activity-bar.html', true],
  ['session replay', 'http://localhost:3000/tests/activity-bar.html?replayId=1', false],
])('does not preload for %s', (_name, href, isPromptMode) => {
  LaunchTestWorker.preloadTestWorker(href, isPromptMode)

  expect(IpcParent.create).not.toHaveBeenCalled()
})

test('preload handles rejection, execution reports it, and a later retry relaunches', async () => {
  const launchError = new Error('failed to launch Test Worker')
  const ipc = {
    send() {},
  }
  // @ts-ignore
  GetConfiguredWorkerUrl.getConfiguredWorkerUrl.mockReturnValue('file:///test-worker.js')
  // @ts-ignore
  IpcParent.create.mockRejectedValueOnce(launchError).mockResolvedValueOnce(ipc)

  LaunchTestWorker.preloadTestWorker('http://localhost:3000/tests/activity-bar.html', false)
  await Promise.resolve()

  await expect(LaunchTestWorker.launchTestWorker()).rejects.toBe(launchError)
  await expect(LaunchTestWorker.launchTestWorker()).resolves.toBe(ipc)
  expect(IpcParent.create).toHaveBeenCalledTimes(2)
})
