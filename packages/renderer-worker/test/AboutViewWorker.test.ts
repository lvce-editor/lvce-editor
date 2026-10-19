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
const AboutViewWorker = await import('../src/parts/AboutViewWorker/AboutViewWorker.js')

beforeEach(() => {
  jest.resetAllMocks()
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
