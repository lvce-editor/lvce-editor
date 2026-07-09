import { expect, test } from '@jest/globals'
import * as HandleIpcTerminalProcess from '../src/parts/HandleIpcTerminalProcess/HandleIpcTerminalProcess.js'

test('upgradeMessagePort', () => {
  const port: Record<string, any> = {}
  expect(HandleIpcTerminalProcess.upgradeMessagePort(port)).toEqual({
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port],
  })
})

test('upgradeWebSocket', () => {
  const message: Record<string, any> = {}
  const handle = {
    isHandle: true,
  }
  expect(HandleIpcTerminalProcess.upgradeWebSocket(handle, message)).toEqual({
    type: 'send',
    method: 'HandleWebSocket.handleWebSocket',
    params: [
      {
        isHandle: true,
      },
      {},
    ],
  })
})
