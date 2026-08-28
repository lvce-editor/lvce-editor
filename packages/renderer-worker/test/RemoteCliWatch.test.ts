import { afterEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(ipc: unknown, method: string) => Promise<unknown>>()
const handleIpc = jest.fn()
const unhandleIpc = jest.fn()

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({ invoke }))
jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
  handleIpc,
  unhandleIpc,
}))

const RemoteCli = await import('../src/parts/RemoteCli/RemoteCli.js')

afterEach(() => {
  RemoteCli._reset()
  invoke.mockReset()
  handleIpc.mockReset()
  unhandleIpc.mockReset()
})

test('waits for remote requests on the provided authenticated socket', async () => {
  const request = { kind: 'folder', path: '/home/test/project' }
  invoke.mockResolvedValueOnce(request).mockImplementation(
    async () =>
      new Promise(() => {
        // Keep the next long poll active until the watcher is disposed.
      }),
  )
  const close = jest.fn()
  const ipc = {
    listener: undefined,
    onmessage: undefined,
    send: jest.fn(),
    webSocket: { close },
  }
  const create = jest.fn(async (_url: string) => ipc)
  const handleOpenRequest = jest.fn(async (_request: unknown) => {})

  await RemoteCli.start(
    'connection',
    'wss://workspace.example.com/shared-process?token=secret',
    handleOpenRequest,
    create,
  )
  for (let index = 0; index < 4; index++) {
    await Promise.resolve()
  }

  expect(create).toHaveBeenCalledWith(
    'wss://workspace.example.com/shared-process?token=secret',
  )
  expect(invoke).toHaveBeenCalledWith(ipc, 'RemoteCli.waitForOpenRequest')
  expect(handleOpenRequest).toHaveBeenCalledWith(request)

  RemoteCli.stop()
  expect(unhandleIpc).toHaveBeenCalledWith(ipc)
  expect(close).toHaveBeenCalledTimes(1)
})
