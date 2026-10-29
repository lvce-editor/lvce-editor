import { beforeEach, expect, jest, test } from '@jest/globals'

const acquire = jest.fn<() => Promise<any>>()
const release = jest.fn()
const invokeAndTransfer = jest.fn<(...params: any[]) => Promise<void>>()
jest.unstable_mockModule('../src/parts/AuthProcess/AuthProcess.js', () => ({ acquire, release }))
jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({ invokeAndTransfer }))
const { connectMessagePort } = await import('../src/parts/HandleIpcAuthProcess/HandleIpcAuthProcess.js')

beforeEach(() => {
  jest.clearAllMocks()
  invokeAndTransfer.mockResolvedValue(undefined)
})

test('reserves before transfer and forwards the connection identity', async () => {
  const port = { close: jest.fn() }
  const ipc = {}
  acquire.mockResolvedValue({ connectionId: 'connection', ipc })
  expect(await connectMessagePort(port, { ipcId: 42 })).toEqual({ response: { type: 'handle' }, target: ipc })
  expect(invokeAndTransfer).toHaveBeenCalledWith(ipc, 'HandleMessagePort.handleMessagePort', port, 42, 'connection')
  expect(release).not.toHaveBeenCalled()
})

test('failed transfer rolls back only its reservation and closes the port', async () => {
  const port = { close: jest.fn() }
  acquire.mockResolvedValue({ connectionId: 'failed-connection', ipc: {} })
  invokeAndTransfer.mockRejectedValueOnce(new Error('transfer failed'))
  await expect(connectMessagePort(port, {})).rejects.toThrow('transfer failed')
  expect(release).toHaveBeenCalledWith('failed-connection')
  expect(port.close).toHaveBeenCalledTimes(1)
})

test('failed launch closes the untransferred port without releasing an unrelated reservation', async () => {
  const port = { close: jest.fn() }
  acquire.mockRejectedValueOnce(new Error('launch failed'))
  await expect(connectMessagePort(port, {})).rejects.toThrow('launch failed')
  expect(release).not.toHaveBeenCalled()
  expect(port.close).toHaveBeenCalledTimes(1)
})
