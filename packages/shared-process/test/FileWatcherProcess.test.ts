import { beforeEach, expect, jest, test } from '@jest/globals'
import { EventEmitter } from 'node:events'

jest.unstable_mockModule('../src/parts/LaunchFileWatcherProcess/LaunchFileWatcherProcess.ts', () => ({ launchFileWatcherProcess: jest.fn() }))
jest.unstable_mockModule('../src/parts/FileWatcher/FileWatcher.ts', () => ({ handleProcessClose: jest.fn() }))
const Process = await import('../src/parts/FileWatcherProcess/FileWatcherProcess.ts')
const Launch = await import('../src/parts/LaunchFileWatcherProcess/LaunchFileWatcherProcess.ts')
const Watcher = await import('../src/parts/FileWatcher/FileWatcher.ts')

beforeEach(() => {
  jest.clearAllMocks()
  Process.state.ipc = undefined
})

test('disconnect reports failure and permits a new backend connection', async () => {
  const ipc = new EventTarget()
  jest.mocked(Launch.launchFileWatcherProcess).mockResolvedValue(ipc)
  expect(await Process.getOrCreate()).toBe(ipc)
  ipc.dispatchEvent(new Event('close'))
  expect(Watcher.handleProcessClose).toHaveBeenCalledTimes(1)
  expect(Process.state.ipc).toBeUndefined()
  const next = new EventTarget()
  jest.mocked(Launch.launchFileWatcherProcess).mockResolvedValue(next)
  expect(await Process.getOrCreate()).toBe(next)
  ipc.dispatchEvent(new Event('close'))
  expect(Watcher.handleProcessClose).toHaveBeenCalledTimes(1)
})

test('failed backend launch can be retried', async () => {
  jest.mocked(Launch.launchFileWatcherProcess).mockRejectedValueOnce(new Error('failed launch'))
  await expect(Process.getOrCreate()).rejects.toThrow('failed launch')
  expect(Process.state.ipc).toBeUndefined()
  const ipc = new EventTarget()
  jest.mocked(Launch.launchFileWatcherProcess).mockResolvedValue(ipc)
  expect(await Process.getOrCreate()).toBe(ipc)
})

test('pending readiness rejects on disconnect and removes callback/listener ownership', async () => {
  const ipc = new EventTarget() as any
  let request: any
  ipc.send = (message: any): void => {
    request = message
  }
  jest.mocked(Launch.launchFileWatcherProcess).mockResolvedValue(ipc)
  const removed = jest.spyOn(ipc, 'removeEventListener')
  const pending = Process.invoke('FileWatcher.watchFolders', { roots: ['file:///workspace'] })
  const rejected = pending.catch((error: unknown) => error)
  await new Promise((resolve) => setTimeout(resolve, 0))
  expect(request.method).toBe('FileWatcher.watchFolders')
  ipc.dispatchEvent(new Event('close'))
  expect(await rejected).toEqual(expect.objectContaining({ message: expect.stringContaining('disconnected') }))
  expect(removed).toHaveBeenCalledWith('close', expect.any(Function))
  expect(removed).toHaveBeenCalledWith('message', expect.any(Function))
})

test('send failures reject the pending request and remove temporary listeners', async () => {
  const ipc = new EventTarget() as any
  ipc.send = (): never => {
    throw new Error('send failed')
  }
  jest.mocked(Launch.launchFileWatcherProcess).mockResolvedValue(ipc)
  const removed = jest.spyOn(ipc, 'removeEventListener')
  await expect(Process.invoke('FileWatcher.watchFolders')).rejects.toThrow('send failed')
  expect(removed).toHaveBeenCalledTimes(2)
})

test('a response immediately followed by close is settled exactly once', async () => {
  const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.ts')
  const ipc = new EventTarget() as any
  ipc.addEventListener('message', (event: any) => JsonRpc.resolve(event.data.id, event.data))
  ipc.send = (message: any): void => {
    ipc.dispatchEvent(new MessageEvent('message', { data: { id: message.id, result: { ok: true } } }))
    ipc.dispatchEvent(new Event('close'))
  }
  jest.mocked(Launch.launchFileWatcherProcess).mockResolvedValue(ipc)
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  try {
    await expect(Process.invoke('FileWatcher.watchFolders')).resolves.toEqual({ ok: true })
    expect(warn).not.toHaveBeenCalled()
  } finally {
    warn.mockRestore()
  }
})

test('Electron port observers preserve the existing response listener', async () => {
  const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.ts')
  const port = new EventEmitter()
  const originalListener = (event: any): void => JsonRpc.resolve(event.data.id, event.data)
  port.on('message', originalListener)
  const ipc = {
    on: port.on.bind(port),
    port,
    send(message: any): void {
      port.emit('message', { data: { id: message.id, result: { ok: true } } })
    },
  }
  jest.mocked(Launch.launchFileWatcherProcess).mockResolvedValue(ipc)
  await expect(Process.invoke('FileWatcher.watchFolders')).resolves.toEqual({ ok: true })
  expect(port.listeners('message')).toEqual([originalListener])
  expect(port.listenerCount('close')).toBe(1)
  port.emit('close')
})
