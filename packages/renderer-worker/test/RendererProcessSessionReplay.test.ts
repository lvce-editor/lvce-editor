import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

const port1 = { close: jest.fn() }
const port2 = { close: jest.fn() }
const originalChannel = MessageChannel
const rpc = {}
const originalRpc = {}
const create = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>().mockResolvedValue(rpc)
const invokeAndTransfer = jest.fn<(...args: readonly unknown[]) => Promise<string>>()
const reset = jest.fn()
jest.unstable_mockModule('../../../static/js/lvce-editor-rpc.js', () => ({ PlainMessagePortRpc: { create }, WebWorkerRpcClient2: {} }))
jest.unstable_mockModule('../src/parts/CommandMapRef/CommandMapRef.js', () => ({ commandMapRef: {} }))
jest.unstable_mockModule('../src/parts/RendererFrameScheduler/RendererFrameScheduler.js', () => ({ invokeAndTransfer, reset }))
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')

beforeEach(() => {
  jest.clearAllMocks()
  globalThis.MessageChannel = class {
    port1 = port1
    port2 = port2
  } as unknown as typeof MessageChannel
  RendererProcess.state.rpc = originalRpc
})
afterEach(() => {
  globalThis.MessageChannel = originalChannel
})

test('switches renderer transport only after the proxy accepts the transferred port', async () => {
  const pending = Promise.withResolvers<string>()
  invokeAndTransfer.mockReturnValue(pending.promise)
  const options = { local: true, upload: false }
  const result = RendererProcess.configureSessionReplay(options)
  await Promise.resolve()
  expect(create).toHaveBeenCalledWith({ commandMap: {}, messagePort: port1 })
  expect(invokeAndTransfer).toHaveBeenCalledWith('SessionReplay.configureProxy', options, port2)
  expect(RendererProcess.state.rpc).toBe(originalRpc)
  expect(reset).not.toHaveBeenCalled()
  pending.resolve('session-id')
  await expect(result).resolves.toBe('session-id')
  expect(RendererProcess.state.rpc).toBe(rpc)
  expect(reset).toHaveBeenCalledWith(rpc)
})

test('closes the proposed channel and preserves the renderer transport on setup failure', async () => {
  invokeAndTransfer.mockRejectedValue(new Error('setup failed'))
  await expect(RendererProcess.configureSessionReplay({ local: true, upload: false })).rejects.toThrow('setup failed')
  expect(port1.close).toHaveBeenCalledTimes(1)
  expect(port2.close).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.rpc).toBe(originalRpc)
  expect(reset).not.toHaveBeenCalled()
})
