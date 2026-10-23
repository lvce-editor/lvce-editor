import { beforeEach, expect, jest, test } from '@jest/globals'

const worker = {
  dispose: jest.fn(async () => {}),
  invoke: jest.fn<(...args: readonly unknown[]) => Promise<unknown>>(),
  invokeAndTransfer: jest.fn<(...args: readonly unknown[]) => Promise<unknown>>(),
}
// eslint-disable-next-line jest/no-restricted-jest-methods -- Control transport completion to reproduce disposal before an RPC response.
jest.unstable_mockModule('../src/parts/GetOrCreateWorker/GetOrCreateWorker.js', () => ({
  getOrCreateWorker: (): typeof worker => worker,
}))
const viewState = { present: false }
// eslint-disable-next-line jest/no-restricted-jest-methods -- Reproduce a replacement view being registered before the old opening RPC finishes.
jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({
  getInstance: (): Record<string, never> | undefined => (viewState.present ? {} : undefined),
}))
const AboutViewWorker = await import('../src/parts/AboutViewWorker/AboutViewWorker.js')

beforeEach(() => {
  jest.resetAllMocks()
  viewState.present = false
})

test('closing About preserves the pending response to the RPC that opened it', async () => {
  const opening = Promise.withResolvers<string>()
  worker.invoke.mockReturnValueOnce(opening.promise)
  const result = AboutViewWorker.invoke('About.showAbout', 1)

  // Widget disposal must return while opening is pending, allowing its response to arrive.
  await AboutViewWorker.dispose()
  expect(worker.dispose).not.toHaveBeenCalled()
  expect(worker.invoke).toHaveBeenCalledWith('About.showAbout', 1)

  opening.resolve('opened')
  await expect(result).resolves.toBe('opened')
  expect(worker.dispose).toHaveBeenCalledTimes(1)
})

test('disposal waits for every active RPC, including transferred ports and rejected calls', async () => {
  const opening = Promise.withResolvers<void>()
  const connection = Promise.withResolvers<void>()
  worker.invoke.mockReturnValueOnce(opening.promise)
  worker.invokeAndTransfer.mockReturnValueOnce(connection.promise)
  const first = AboutViewWorker.invoke('About.showAbout', 1)
  const second = AboutViewWorker.invokeAndTransfer('About.handleMessagePort', 'port')

  await AboutViewWorker.dispose()
  opening.resolve()
  await first
  expect(worker.dispose).not.toHaveBeenCalled()

  const failure = new Error('connection failed')
  connection.reject(failure)
  await expect(second).rejects.toBe(failure)
  expect(worker.dispose).toHaveBeenCalledTimes(1)
})

test('an idle worker can be disposed immediately and used again', async () => {
  await AboutViewWorker.dispose()
  expect(worker.dispose).toHaveBeenCalledTimes(1)

  worker.invoke.mockResolvedValueOnce('reopened')
  await expect(AboutViewWorker.invoke('About.showAbout', 1)).resolves.toBe('reopened')
  expect(worker.dispose).toHaveBeenCalledTimes(1)
})

test('keeps the worker serving a replacement About view after the opening response', async () => {
  const opening = Promise.withResolvers<string>()
  worker.invoke.mockReturnValueOnce(opening.promise)
  const result = AboutViewWorker.invoke('About.showAbout', 1)

  await AboutViewWorker.dispose()
  viewState.present = true
  opening.resolve('replacement opened')

  await expect(result).resolves.toBe('replacement opened')
  expect(worker.dispose).not.toHaveBeenCalled()

  viewState.present = false
  await AboutViewWorker.dispose()
  expect(worker.dispose).toHaveBeenCalledTimes(1)
})

test('a delayed disposal keeps an idle worker serving a replacement About view', async () => {
  viewState.present = true
  await AboutViewWorker.dispose()
  expect(worker.dispose).not.toHaveBeenCalled()
})
