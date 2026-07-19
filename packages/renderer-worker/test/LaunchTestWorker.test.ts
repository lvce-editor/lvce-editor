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

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => {
  return {
    invokeAndTransfer: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invokeAndTransfer: jest.fn(),
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
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')
const LaunchTestWorker = await import('../src/parts/LaunchTestWorker/LaunchTestWorker.ts')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const TestWorker = await import('../src/parts/TestWorker/TestWorker.js')
const jsonRpcInvokeAndTransfer = jest.mocked(JsonRpc.invokeAndTransfer)
const rendererProcessInvokeAndTransfer = jest.mocked(RendererProcess.invokeAndTransfer)

beforeEach(() => {
  jest.resetAllMocks()
  LaunchTestWorker.reset()
})

test('launchTestWorker connects the test worker directly to the renderer process', async () => {
  const ipc = {
    send(): void {},
  }
  // @ts-ignore
  GetConfiguredWorkerUrl.getConfiguredWorkerUrl.mockReturnValue('file:///test-worker.js')
  // @ts-ignore
  IpcParent.create.mockResolvedValue(ipc)

  const result = await LaunchTestWorker.launchTestWorker()

  expect(IpcParent.create).toHaveBeenCalledTimes(1)
  expect(IpcParent.create).toHaveBeenCalledWith({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Test Worker',
    url: 'file:///test-worker.js',
  })
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(ipc)
  expect(TestWorker.set).toHaveBeenCalledWith(ipc)
  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledWith('TestWorkerRpc.initialize', expect.any(MessagePort))
  expect(JsonRpc.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(JsonRpc.invokeAndTransfer).toHaveBeenCalledWith(ipc, 'RendererProcess.initialize', expect.any(MessagePort))
  expect(rendererProcessInvokeAndTransfer.mock.calls[0][1]).not.toBe(jsonRpcInvokeAndTransfer.mock.calls[0][2])
  expect(rendererProcessInvokeAndTransfer.mock.invocationCallOrder[0]).toBeLessThan(jsonRpcInvokeAndTransfer.mock.invocationCallOrder[0])
  expect(result).toBe(ipc)
})

test('preload starts the configured Test Worker once and execution reuses it', async () => {
  const ipc = {
    send(): void {},
  }
  const { promise: workerPromise, resolve: resolveWorker } = Promise.withResolvers<typeof ipc>()
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
    send(): void {},
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
