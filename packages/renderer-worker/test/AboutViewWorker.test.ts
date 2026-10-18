import { expect, jest, test } from '@jest/globals'

const setup = async () => {
  jest.resetModules()
  const worker = {
    dispose: jest.fn(async () => {}),
    invoke: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    invokeAndTransfer: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  }
  jest.unstable_mockModule('../src/parts/GetOrCreateWorker/GetOrCreateWorker.js', () => ({
    getOrCreateWorker: () => worker,
  }))
  const AboutViewWorker = await import('../src/parts/AboutViewWorker/AboutViewWorker.js')
  return { AboutViewWorker, worker }
}

test('closing About preserves the pending response to the RPC that opened it', async () => {
  const { AboutViewWorker, worker } = await setup()
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
  const { AboutViewWorker, worker } = await setup()
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
  const rejected = expect(second).rejects.toBe(failure)
  connection.reject(failure)
  await rejected
  expect(worker.dispose).toHaveBeenCalledTimes(1)
})

test('an idle worker can be disposed immediately and used again', async () => {
  const { AboutViewWorker, worker } = await setup()
  await AboutViewWorker.dispose()
  expect(worker.dispose).toHaveBeenCalledTimes(1)

  worker.invoke.mockResolvedValueOnce('reopened')
  await expect(AboutViewWorker.invoke('About.showAbout', 1)).resolves.toBe('reopened')
  expect(worker.dispose).toHaveBeenCalledTimes(1)
})
