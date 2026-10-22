import { afterEach, expect, jest, test } from '@jest/globals'

const getWebSocketUrl = jest.fn(async () => 'wss://remote.example/websocket/shared-process?ticket=temporary')
jest.unstable_mockModule('../src/parts/WorkspaceConnection/WorkspaceConnection.js', () => ({ getWebSocketUrl }))
const { watch } = await import('../src/parts/FileWatcher/RemoteFileWatcher.js')

afterEach(() => {
  jest.restoreAllMocks()
})

test('watches remote disk paths, maps notifications back to workspace URIs, and releases the socket', async () => {
  const socket: any = { close: jest.fn(), send: jest.fn() }
  jest.spyOn(globalThis, 'WebSocket').mockImplementation(() => socket)
  const onEvent = jest.fn()
  const pending = watch({ roots: ['remote-server://remote.example/home/a%20b'], exclude: [] }, onEvent)
  await Promise.resolve()
  socket.onopen()
  expect(JSON.parse(socket.send.mock.calls[0][0])).toMatchObject({
    method: 'FileWatcher.watch',
    params: [1, { roots: ['file:///home/a%20b'], exclude: [] }],
  })
  socket.onmessage({ data: JSON.stringify({ id: 1, result: { ok: true } }) })
  const dispose: any = await pending
  socket.onmessage({
    data: JSON.stringify({ method: 'FileWatcher.handleEvent', params: [1, { eventName: 'change', uri: 'file:///home/a%20b/new.ts' }] }),
  })
  expect(onEvent).toHaveBeenCalledWith({ eventName: 'change', uri: 'remote-server://remote.example/home/a%20b/new.ts' })
  dispose()
  dispose()
  expect(socket.close).toHaveBeenCalledTimes(1)
})

test('rejects cross-server watcher roots before making any connection', async () => {
  await expect(watch({ roots: ['remote-server://one/project', 'remote-server://two/project'] }, jest.fn())).rejects.toThrow('one server')
})
