import { expect, jest, test } from '@jest/globals'
import { EventEmitter } from 'events'

jest.unstable_mockModule('../src/parts/ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc', () => {
  return {
    create: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc', () => {
  return {
    handleIpc: jest.fn(),
  }
})

const HandleMessagePortForExtensionHostHelperProcess = await import(
  '../src/parts/HandleMessagePortForExtensionHostHelperProcess/HandleMessagePortForExtensionHostHelperProcess.js'
)
const ExtensionHostHelperProcessIpc = await import('../src/parts/ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')

// TODO there are still 3 race conditions:
// 1. rendererWorkerIpc is disposed while HandleMessagePortForExtensionHostHelperProcess.js is loading
// 2. rendererWorkerIpc is disposed while utility process is created
// 3. rendererWorkerIpc is disposed while the messageport is transferred
test.skip('handleMessagePortForExtensionHostHelperProcess - close', async () => {
  const rendererWorkerIpc = new EventEmitter()
  const port = {
    __isMessagePort: true,
  }
  const ipc = {
    __isIpc: true,
    dispose: jest.fn(),
    sendAndTransfer: jest.fn((message) => {
      // @ts-ignore
      JsonRpc.resolve(message.id, {
        result: null,
      })
    }),
  }
  // @ts-ignore
  ExtensionHostHelperProcessIpc.create.mockImplementation(() => {
    return ipc
  })
  await HandleMessagePortForExtensionHostHelperProcess.handleMessagePortForExtensionHostHelperProcess(rendererWorkerIpc, port)
  rendererWorkerIpc.emit('close')
  expect(ipc.dispose).toHaveBeenCalledTimes(1)
  expect(rendererWorkerIpc.listenerCount('close')).toBe(0)
})

test.skip('handleMessagePortForExtensionHostHelperProcess - close', async () => {
  const rendererWorkerIpc = new EventEmitter()
  const port = {
    __isMessagePort: true,
  }
  const ipc = {
    __isIpc: true,
    dispose: jest.fn(),
    sendAndTransfer: jest.fn((message) => {
      // @ts-ignore
      JsonRpc.resolve(message.id, {
        result: null,
      })
    }),
  }
  // @ts-ignore
  ExtensionHostHelperProcessIpc.create.mockImplementation(() => {
    return ipc
  })
  await HandleMessagePortForExtensionHostHelperProcess.handleMessagePortForExtensionHostHelperProcess(rendererWorkerIpc, port)
  expect(ipc.sendAndTransfer).toHaveBeenCalledTimes(1)
  expect(ipc.sendAndTransfer).toHaveBeenCalledWith(
    {
      id: expect.any(Number),
      jsonrpc: '2.0',
      method: 'HandleElectronMessagePort.handleElectronMessagePort',
      params: [],
    },
    // @ts-ignore
    [port],
  )
})
