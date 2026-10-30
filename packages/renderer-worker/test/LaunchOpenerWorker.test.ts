import { expect, jest, test } from '@jest/globals'

const ipc = { send: jest.fn() }
const create = jest.fn(async () => ipc)
const handleIpc = jest.fn()
const invoke = jest.fn<(...args: any[]) => Promise<void>>()
jest.unstable_mockModule('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts', () => ({
  getConfiguredWorkerUrl: () => 'file:///opener.js',
}))
jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => ({ create }))
jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({ handleIpc }))
jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({ invoke }))
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({ getPlatform: () => 2 }))
const { launchOpenerWorker } = await import('../src/parts/LaunchOpenerWorker/LaunchOpenerWorker.ts')

test('native opens cannot race the opener’s initial shared-process connection', async () => {
  const started = Promise.withResolvers<void>()
  const ready = Promise.withResolvers<void>()
  invoke.mockImplementationOnce(async () => {
    started.resolve()
    await ready.promise
  })
  let completed = false
  const launching = launchOpenerWorker().then((result) => {
    completed = true
    return result
  })
  await started.promise
  expect(completed).toBe(false)
  expect(handleIpc).toHaveBeenCalledWith(ipc)
  expect(invoke).toHaveBeenCalledWith(ipc, 'Open.initialize', 2)
  ready.resolve()
  expect(await launching).toBe(ipc)
})
