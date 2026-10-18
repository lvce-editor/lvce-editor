import { expect, jest, test } from '@jest/globals'

test('dispose clears viewlet state before terminating its worker', async () => {
  jest.resetModules()
  const calls: string[] = []
  const viewletDispose = jest.fn(async () => {
    calls.push('viewlet')
  })
  const workerDispose = jest.fn(async () => {
    calls.push('worker')
  })
  jest.unstable_mockModule('../src/parts/AboutViewWorker/AboutViewWorker.js', () => ({
    dispose: workerDispose,
  }))
  jest.unstable_mockModule('../src/parts/CreateWorkerViewlet/CreateWorkerViewlet.js', () => ({
    createWorkerViewlet: () => ({ dispose: viewletDispose }),
  }))

  const ViewletAbout = await import('../src/parts/ViewletAbout/ViewletAbout.ipc.ts')
  await ViewletAbout.dispose()

  expect(viewletDispose).toHaveBeenCalledTimes(1)
  expect(workerDispose).toHaveBeenCalledTimes(1)
  expect(calls).toEqual(['viewlet', 'worker'])
})

test('dispose terminates its worker when the viewlet has no state cleanup', async () => {
  jest.resetModules()
  const workerDispose = jest.fn()
  jest.unstable_mockModule('../src/parts/AboutViewWorker/AboutViewWorker.js', () => ({
    dispose: workerDispose,
  }))
  jest.unstable_mockModule('../src/parts/CreateWorkerViewlet/CreateWorkerViewlet.js', () => ({
    createWorkerViewlet: () => ({}),
  }))

  const ViewletAbout = await import('../src/parts/ViewletAbout/ViewletAbout.ipc.ts')
  await ViewletAbout.dispose()

  expect(workerDispose).toHaveBeenCalledTimes(1)
})
