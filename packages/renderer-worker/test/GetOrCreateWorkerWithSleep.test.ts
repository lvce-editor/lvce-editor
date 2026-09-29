/* eslint-disable jest/no-restricted-jest-methods -- Worker lifecycle tests use an ESM module mock for the worker dependency. */
import { beforeEach, expect, jest, test } from '@jest/globals'

const worker = {
  dispose: jest.fn<() => Promise<void>>(),
  invoke: jest.fn<(method: string, ...params: readonly unknown[]) => Promise<unknown>>(),
  invokeAndTransfer: jest.fn<(method: string, ...params: readonly unknown[]) => Promise<unknown>>(),
  restart: jest.fn<(terminateCommand: string) => Promise<void>>(),
}

jest.unstable_mockModule('../src/parts/GetOrCreateWorker/GetOrCreateWorker.js', () => ({
  getOrCreateWorker: jest.fn(() => worker),
}))

const GetOrCreateWorkerWithSleep = await import('../src/parts/GetOrCreateWorkerWithSleep/GetOrCreateWorkerWithSleep.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('invokes an awake worker without a wake-up command', async () => {
  worker.invoke.mockResolvedValue('result')
  const wrappedWorker = GetOrCreateWorkerWithSleep.getOrCreateWorkerWithSleep(jest.fn(), 'Worker.sleep', 'Worker.wakeUp')

  await expect(wrappedWorker.invoke('Worker.doSomething', 1)).resolves.toBe('result')

  expect(worker.invoke).toHaveBeenCalledTimes(1)
  expect(worker.invoke).toHaveBeenCalledWith('Worker.doSomething', 1)
})

test('transfers to an awake worker without a wake-up command', async () => {
  worker.invokeAndTransfer.mockResolvedValue('result')
  const wrappedWorker = GetOrCreateWorkerWithSleep.getOrCreateWorkerWithSleep(jest.fn(), 'Worker.sleep', 'Worker.wakeUp')

  await expect(wrappedWorker.invokeAndTransfer('Worker.handleMessagePort', 1)).resolves.toBe('result')

  expect(worker.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(worker.invokeAndTransfer).toHaveBeenCalledWith('Worker.handleMessagePort', 1)
})

test('sleeps and restores a worker before its next invocations', async () => {
  const sleepState = { uid: 1, content: ['Item 1'] }
  worker.invoke.mockImplementation(async (method) => {
    if (method === 'Worker.sleep') {
      return sleepState
    }
    return undefined
  })
  const wrappedWorker = GetOrCreateWorkerWithSleep.getOrCreateWorkerWithSleep(jest.fn(), 'Worker.sleep', 'Worker.wakeUp')

  await wrappedWorker.sleep(1)
  await Promise.all([wrappedWorker.invoke('Worker.firstEvent', 1), wrappedWorker.invoke('Worker.secondEvent', 1)])

  expect(worker.dispose).toHaveBeenCalledTimes(1)
  expect(worker.invoke).toHaveBeenNthCalledWith(1, 'Worker.sleep', 1)
  expect(worker.invoke).toHaveBeenNthCalledWith(2, 'Worker.wakeUp', sleepState)
  expect(worker.invoke).toHaveBeenNthCalledWith(3, 'Worker.firstEvent', 1)
  expect(worker.invoke).toHaveBeenNthCalledWith(4, 'Worker.secondEvent', 1)
})

test('waits for active invocations before sleeping', async () => {
  let resolveInvocation
  let markInvocationStarted
  const invocationStarted = new Promise<void>((resolve) => {
    markInvocationStarted = resolve
  })
  const invocation = new Promise<void>((resolve) => {
    resolveInvocation = resolve
  })
  worker.invoke.mockImplementation(async (method) => {
    if (method === 'Worker.activeEvent') {
      markInvocationStarted()
      return invocation
    }
    return {}
  })
  const wrappedWorker = GetOrCreateWorkerWithSleep.getOrCreateWorkerWithSleep(jest.fn(), 'Worker.sleep', 'Worker.wakeUp')

  const activeInvocation = wrappedWorker.invoke('Worker.activeEvent')
  await invocationStarted
  const sleep = wrappedWorker.sleep(1)

  expect(worker.invoke).not.toHaveBeenCalledWith('Worker.sleep', 1)
  resolveInvocation()
  await activeInvocation
  await sleep

  expect(worker.invoke).toHaveBeenNthCalledWith(1, 'Worker.activeEvent')
  expect(worker.invoke).toHaveBeenNthCalledWith(2, 'Worker.sleep', 1)
})

test('waits for cleanup before handling a new event', async () => {
  const sleepState = { uid: 1 }
  let resolveSleep
  let markSleepStarted
  const sleepStarted = new Promise<void>((resolve) => {
    markSleepStarted = resolve
  })
  const sleepResult = new Promise((resolve) => {
    resolveSleep = resolve
  })
  worker.invoke.mockImplementation(async (method) => {
    if (method === 'Worker.sleep') {
      markSleepStarted()
      return sleepResult
    }
    return undefined
  })
  const wrappedWorker = GetOrCreateWorkerWithSleep.getOrCreateWorkerWithSleep(jest.fn(), 'Worker.sleep', 'Worker.wakeUp')

  const sleep = wrappedWorker.sleep(1)
  await sleepStarted
  const invocation = wrappedWorker.invoke('Worker.eventDuringCleanup', 1)

  expect(worker.invoke).not.toHaveBeenCalledWith('Worker.eventDuringCleanup', 1)
  resolveSleep(sleepState)
  await sleep
  await invocation

  expect(worker.invoke).toHaveBeenNthCalledWith(1, 'Worker.sleep', 1)
  expect(worker.invoke).toHaveBeenNthCalledWith(2, 'Worker.wakeUp', sleepState)
  expect(worker.invoke).toHaveBeenNthCalledWith(3, 'Worker.eventDuringCleanup', 1)
})
