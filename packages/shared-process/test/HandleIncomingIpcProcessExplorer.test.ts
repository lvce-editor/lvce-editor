import { expect, jest, test } from '@jest/globals'
import * as IpcId from '../src/parts/IpcId/IpcId.js'

const error = new Error('Transfer failed')
const applyIncomingIpcResponse = jest.fn(async () => error)
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

jest.unstable_mockModule('../src/parts/ApplyIncomingIpcResponse/ApplyIncomingIpcResponse.js', () => ({
  applyIncomingIpcResponse,
}))

jest.unstable_mockModule('../src/parts/HandleIpcModule/HandleIpcModule.js', () => ({
  getModule,
}))

jest.unstable_mockModule('../src/parts/HandleIncomingIpcWebSocket/HandleIncomingIpcWebSocket.js', () => ({
  handleIncomingIpcWebSocket,
}))

jest.unstable_mockModule('../src/parts/IsMessagePortMain/IsMessagePortMain.js', () => ({
  isMessagePortMain: (): any => false,
}))

jest.unstable_mockModule('../src/parts/IsSocket/IsSocket.js', () => ({
  isSocket: (): any => true,
}))

jest.unstable_mockModule('../src/parts/ProcessExplorer/ProcessExplorer.js', () => ({
  decreaseRefCount,
}))

const HandleIncomingIpc = await import('../src/parts/HandleIncomingIpc/HandleIncomingIpc.js')

test('handleIncomingIpc - logs forwarding error and decrements process explorer ref count', async () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

  await expect(HandleIncomingIpc.handleIncomingIpc(IpcId.ProcessExplorer, {}, {})).resolves.toBeUndefined()

  expect(decreaseRefCount).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(error)
  spy.mockRestore()
})
