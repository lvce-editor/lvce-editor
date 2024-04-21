import { expect, test } from '@jest/globals'
import * as HandleIpcEmbedsProcess from '../src/parts/HandleIpcEmbedsProcess/HandleIpcEmbedsProcess.js'

test('upgradeMessagePort', () => {
  const port = {}
  expect(HandleIpcEmbedsProcess.upgradeMessagePort(port)).toEqual({
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [],
    transfer: [port],
  })
})
