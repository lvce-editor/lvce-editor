import { expect, test } from '@jest/globals'
import * as HandleIpcTerminalProcess from '../src/parts/HandleIpcTerminalProcess/HandleIpcTerminalProcess.js'

test('upgradeMessagePort', () => {
  const port: Record<string, any> = {}
  expect(HandleIpcTerminalProcess.upgradeMessagePort(port)).toEqual({
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port],
    type: 'send',
  })
})

test('upgradeWebSocket', () => {
  const message: Record<string, any> = {}
  const handle = {
    isHandle: true,
  }
  expect(HandleIpcTerminalProcess.upgradeWebSocket(handle, message)).toEqual({
    method: 'HandleWebSocket.handleWebSocket',
    params: [
      {
        isHandle: true,
      },
      {},
    ],
    type: 'send',
  })
})
