import { beforeEach, expect, jest, test } from '@jest/globals'

const launchPtyHost = jest.fn<() => Promise<any>>()
jest.unstable_mockModule('../src/parts/LaunchPtyHost/LaunchPtyHost.ts', () => ({ launchPtyHost }))
const PtyHost = await import('../src/parts/PtyHost/PtyHost.ts')
const TerminalIpc = await import('../src/parts/HandleIpcTerminalProcess/HandleIpcTerminalProcess.ts')

beforeEach(() => {
  PtyHost.disposeAll()
  launchPtyHost.mockReset()
  launchPtyHost.mockImplementation(async () => ({ dispose: jest.fn() }))
})

test('reserves both windows before a delayed launch and retires only after both close', async () => {
  const ready = Promise.withResolvers<any>()
  launchPtyHost.mockReturnValueOnce(ready.promise)
  const first = PtyHost.acquire(1)
  const second = PtyHost.acquire(1)
  expect(launchPtyHost).toHaveBeenCalledTimes(1)
  const ipc = { dispose: jest.fn() }
  ready.resolve(ipc)
  await first.promise
  PtyHost.release(first.id)
  expect(ipc.dispose).not.toHaveBeenCalled()
  PtyHost.release(second.id)
  expect(PtyHost.getCurrentInstance()).toBeUndefined()
  const third = PtyHost.acquire(1)
  expect(await third.promise).not.toBe(ipc)
  await Promise.resolve()
  expect(ipc.dispose).toHaveBeenCalledTimes(1)
  PtyHost.release(first.id)
  PtyHost.release(second.id)
  expect(PtyHost.getCurrentInstance()).toBe(await third.promise)
  PtyHost.release(third.id)
})

test('release during launch cannot overwrite the replacement process', async () => {
  const ready = Promise.withResolvers<any>()
  launchPtyHost.mockReturnValueOnce(ready.promise)
  const first = PtyHost.acquire(1)
  PtyHost.release(first.id)
  const second = PtyHost.acquire(1)
  const replacement = await second.promise
  const old = { dispose: jest.fn() }
  ready.resolve(old)
  await first.promise
  await Promise.resolve()
  expect(PtyHost.getCurrentInstance()).toBe(replacement)
  expect(old.dispose).toHaveBeenCalledTimes(1)
  PtyHost.release(second.id)
})

test('failed launch is released and the next acquisition retries', async () => {
  launchPtyHost.mockRejectedValueOnce(new Error('launch failed'))
  await expect(TerminalIpc.connectMessagePort({}, {})).rejects.toThrow('launch failed')
  const second = await TerminalIpc.connectMessagePort({}, {})
  expect(launchPtyHost).toHaveBeenCalledTimes(2)
  second.complete()
  second.release()
})

test.each(['connectMessagePort', 'connectWebSocket'] as const)(
  '%s forwards a unique reservation and can release a failed transfer',
  async (method) => {
    const first = await TerminalIpc[method]({}, {})
    const second = await TerminalIpc[method]({}, {})
    expect(first.target).toBe(second.target)
    const firstId = first.response.params.at(-1)
    const secondId = second.response.params.at(-1)
    expect(firstId).not.toBe(secondId)
    first.complete()
    second.complete()
    first.release()
    first.release()
    expect(first.target.dispose).not.toHaveBeenCalled()
    second.release()
    await Promise.resolve()
    expect(first.target.dispose).toHaveBeenCalledTimes(1)
  },
)

test('a disconnect during forwarding waits for the acknowledgement before retiring', async () => {
  const connection = await TerminalIpc.connectMessagePort({}, {})
  PtyHost.release(connection.response.params.at(-1))
  expect(connection.target.dispose).not.toHaveBeenCalled()
  connection.complete()
  await Promise.resolve()
  expect(connection.target.dispose).toHaveBeenCalledTimes(1)
})
