import { expect, test } from '@jest/globals'
import * as HandleIpcProcessExplorer from '../src/parts/HandleIpcProcessExplorer/HandleIpcProcessExplorer.js'

test('upgradeMessagePort', () => {
  const port = {}
  expect(HandleIpcProcessExplorer.upgradeMessagePort(port)).toEqual({
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [],
    transfer: [port],
  })
})
