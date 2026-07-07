import { expect, jest, test } from '@jest/globals'
import * as IpcId from '../src/parts/IpcId/IpcId.js'

const applyIncomingIpcResponse = jest.fn(async () => {
  throw new Error('Transfer failed')
})
const decreaseRefCount = jest.fn()
const getModule = jest.fn(() => ({}))
const handleIncomingIpcWebSocket = jest.fn(async () => ({
  response: {
    method: 'HandleWebSocket.handleWebSocket',
    params: [],
    type: 'send',
  },
  target: {},
}))

jest.unstable_mockModule(
  '../src/parts/ApplyIncomingIpcResponse/ApplyIncomingIpcResponse.js',
  () => ({
    applyIncomingIpcResponse,
  }),
)

jest.unstable_mockModule('../src/parts/HandleIpcModule/HandleIpcModule.js', () => ({
  getModule,
}))

jest.unstable_mockModule(
  '../src/parts/HandleIncomingIpcWebSocket/HandleIncomingIpcWebSocket.js',
  () => ({
    handleIncomingIpcWebSocket,
  }),
)

jest.unstable_mockModule('../src/parts/IsMessagePortMain/IsMessagePortMain.js', () => ({
  isMessagePortMain: () => false,
}))

jest.unstable_mockModule('../src/parts/IsSocket/IsSocket.js', () => ({
  isSocket: () => true,
}))

jest.unstable_mockModule('../src/parts/ProcessExplorer/ProcessExplorer.js', () => ({
  decreaseRefCount,
}))

const HandleIncomingIpc = await import(
  '../src/parts/HandleIncomingIpc/HandleIncomingIpc.js'
)

test('handleIncomingIpc - decrements process explorer ref count when forwarding fails', async () => {
  await expect(
    HandleIncomingIpc.handleIncomingIpc(IpcId.ProcessExplorer, {}, {}),
  ).rejects.toThrow('Transfer failed')

  expect(decreaseRefCount).toHaveBeenCalledTimes(1)
})
