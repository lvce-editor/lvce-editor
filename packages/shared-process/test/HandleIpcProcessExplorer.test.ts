import { expect, test } from '@jest/globals'
import * as HandleIpcProcessExplorer from '../src/parts/HandleIpcProcessExplorer/HandleIpcProcessExplorer.js'

test('upgradeMessagePort', () => {
  const port: Record<string, any> = {}
  expect(HandleIpcProcessExplorer.upgradeMessagePort(port)).toEqual({
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
  expect(HandleIpcProcessExplorer.upgradeWebSocket(handle, message)).toEqual({
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
