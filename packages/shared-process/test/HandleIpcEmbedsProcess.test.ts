import { expect, test } from '@jest/globals'
import * as HandleIpcEmbedsProcess from '../src/parts/HandleIpcEmbedsProcess/HandleIpcEmbedsProcess.js'

test('upgradeMessagePort', () => {
  const port = {}
  const message = {
    ipcId: 1,
  }
  expect(HandleIpcEmbedsProcess.upgradeMessagePort(port, message)).toEqual({
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [1],
    transfer: [port],
  })
})
