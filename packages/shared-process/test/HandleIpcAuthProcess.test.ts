import { expect, test } from '@jest/globals'
import * as HandleIpcAuthProcess from '../src/parts/HandleIpcAuthProcess/HandleIpcAuthProcess.js'

test('upgradeMessagePort', () => {
  const port = {}
  const message = {
    ipcId: 1,
  }
  expect(HandleIpcAuthProcess.upgradeMessagePort(port, message)).toEqual({
    type: 'send',
    method: 'HandleMessagePort.handleMessagePort',
    params: [port, 1],
  })
})
