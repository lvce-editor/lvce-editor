import { expect, test } from '@jest/globals'
import * as HandleIpcProcessExplorer from '../src/parts/HandleIpcProcessExplorer/HandleIpcProcessExplorer.js'

test('upgradeMessagePort', () => {
  const port: Record<string, any> = {}
  expect(HandleIpcProcessExplorer.upgradeMessagePort(port)).toEqual({
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
  expect(HandleIpcProcessExplorer.upgradeWebSocket(handle, message)).toEqual({
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
