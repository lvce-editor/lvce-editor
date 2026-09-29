import { beforeAll, beforeEach, expect, jest, test } from '@jest/globals'
import * as RendererProcessIpcParentType from '../src/parts/RendererProcessIpcParentType/RendererProcessIpcParentType.js'

beforeAll(() => {
  // @ts-ignore
  globalThis.MessagePort = class {}
  globalThis.MessageChannel = class {
    port1: MessagePort
    port2: MessagePort

    constructor() {
      this.port1 = new MessagePort()
      this.port2 = new MessagePort()
    }
  } as any
})

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invokeAndTransfer: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/IpcTrace/IpcTrace.js', () => {
  return {
    maybeCreateProxy: async ({ port }) => port,
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug =
  await import('../src/parts/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js')

test('create', async () => {
  // @ts-ignore
  RendererProcess.invokeAndTransfer.mockImplementation(() => {
    return undefined
  })
  const ipc = await IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.create({
    url: 'https://example.com/worker.js',
    name: 'test worker',
    port: undefined,
    id: 0,
  })
  expect(ipc).toBeInstanceOf(MessagePort)
  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledWith('IpcParent.create', {
    method: RendererProcessIpcParentType.ModuleWorkerWithMessagePort,
    name: 'test worker',
    raw: true,
    url: 'https://example.com/worker.js',
    port: new MessagePort(),
    id: 0,
  })
})

test('create - forwards rpc id', async () => {
  // @ts-ignore
  RendererProcess.invokeAndTransfer.mockImplementation(() => {
    return undefined
  })
  const ipc = await IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.create({
    url: 'https://example.com/worker.js',
    name: 'test worker',
    port: undefined,
    id: 0,
    rpcId: 'MainArea',
  })
  expect(ipc).toBeInstanceOf(MessagePort)
  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledWith('IpcParent.create', {
    method: RendererProcessIpcParentType.ModuleWorkerWithMessagePort,
    name: 'test worker',
    raw: true,
    url: 'https://example.com/worker.js',
    port: new MessagePort(),
    id: 0,
    rpcId: 'MainArea',
  })
})
