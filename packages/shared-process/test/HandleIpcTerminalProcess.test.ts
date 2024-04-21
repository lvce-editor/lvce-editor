import { expect, test } from '@jest/globals'
import * as HandleIpcTerminalProcess from '../src/parts/HandleIpcTerminalProcess/HandleIpcTerminalProcess.js'

test('upgradeMessagePort', () => {
  const port = {}
  expect(HandleIpcTerminalProcess.upgradeMessagePort(port)).toEqual({
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [],
    transfer: [port],
  })
})

test('upgradeWebSocket', () => {
  const message = {}
  const handle = {
    isHandle: true,
  }
  expect(HandleIpcTerminalProcess.upgradeWebSocket(handle, message)).toEqual({
    type: 'send',
    method: 'HandleWebSocket.handleWebSocket',
    params: [{}],
    transfer: {
      isHandle: true,
    },
  })
})
