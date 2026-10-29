import { afterEach, expect, jest, test } from '@jest/globals'

interface TestIpc {
  readonly addEventListener: ReturnType<typeof jest.fn<(event: string, listener: () => void, options?: any) => void>>
  readonly removeEventListener: ReturnType<typeof jest.fn>
  readonly send: ReturnType<typeof jest.fn>
}

const makeIpc = (): TestIpc => ({
  addEventListener: jest.fn<(event: string, listener: () => void, options?: any) => void>(),
  removeEventListener: jest.fn(),
  send: jest.fn(),
})
const launchAuthProcess = jest.fn<() => Promise<any>>()
jest.unstable_mockModule('../src/parts/LaunchAuthProcess/LaunchAuthProcess.js', () => ({ launchAuthProcess }))
const AuthProcess = await import('../src/parts/AuthProcess/AuthProcess.js')

afterEach(async () => {
  await jest.runOnlyPendingTimersAsync()
  jest.useRealTimers()
  launchAuthProcess.mockReset()
})

test('overlapping connections share a process; duplicate and stale closes cannot kill its replacement', async () => {
  jest.useFakeTimers()
  const first = makeIpc()
  const second = makeIpc()
  launchAuthProcess.mockResolvedValueOnce(first).mockResolvedValueOnce(second)
  const [a, b] = await Promise.all([AuthProcess.acquire(), AuthProcess.acquire()])
  expect(a.ipc).toBe(b.ipc)
  expect(launchAuthProcess).toHaveBeenCalledTimes(1)
  AuthProcess.release(a.connectionId)
  AuthProcess.release(a.connectionId)
  await jest.runOnlyPendingTimersAsync()
  expect(first.send).not.toHaveBeenCalled()
  AuthProcess.release(b.connectionId)
  const c = await AuthProcess.acquire()
  expect(c.ipc).toBe(second)
  AuthProcess.release(b.connectionId)
  await jest.runOnlyPendingTimersAsync()
  expect(first.send).toHaveBeenCalledTimes(1)
  expect(first.send).toHaveBeenCalledWith(expect.objectContaining({ method: 'AuthProcess.dispose' }))
  expect(second.send).not.toHaveBeenCalled()
  first.addEventListener.mock.calls[0][1]()
  const d = await AuthProcess.acquire()
  expect(d.ipc).toBe(second)
  AuthProcess.release(c.connectionId)
  AuthProcess.release(d.connectionId)
})

test('a reservation made while launch is pending prevents premature shutdown', async () => {
  jest.useFakeTimers()
  const ipc = makeIpc()
  const launch = Promise.withResolvers<any>()
  launchAuthProcess.mockReturnValueOnce(launch.promise)
  const a = AuthProcess.acquire()
  const b = AuthProcess.acquire()
  launch.resolve(ipc)
  const first = await a
  AuthProcess.release(first.connectionId)
  await jest.runOnlyPendingTimersAsync()
  expect(ipc.send).not.toHaveBeenCalled()
  AuthProcess.release((await b).connectionId)
})

test('failed launch releases all reservations and permits retry', async () => {
  jest.useFakeTimers()
  launchAuthProcess.mockRejectedValueOnce(new Error('launch failed'))
  const results = await Promise.allSettled([AuthProcess.acquire(), AuthProcess.acquire()])
  expect(results.map((result) => result.status)).toEqual(['rejected', 'rejected'])
  const ipc = makeIpc()
  launchAuthProcess.mockResolvedValueOnce(ipc)
  const next = await AuthProcess.acquire()
  expect(next.ipc).toBe(ipc)
  AuthProcess.release(next.connectionId)
})

test('unexpected process close releases its generation without affecting the replacement', async () => {
  jest.useFakeTimers()
  const ipc = makeIpc()
  const nextIpc = makeIpc()
  launchAuthProcess.mockResolvedValueOnce(ipc).mockResolvedValueOnce(nextIpc)
  const a = await AuthProcess.acquire()
  const close = ipc.addEventListener.mock.calls[0][1]
  close()
  const b = await AuthProcess.acquire()
  close()
  AuthProcess.release(a.connectionId)
  await jest.runOnlyPendingTimersAsync()
  expect(nextIpc.send).not.toHaveBeenCalled()
  AuthProcess.release(b.connectionId)
})
