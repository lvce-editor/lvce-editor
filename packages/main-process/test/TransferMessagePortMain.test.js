import * as TransferMessagePortMain from '../src/parts/TransferMessagePortMain/TransferMessagePortMain.js'
import { jest } from '@jest/globals'

test('transferMessagePortMain - error', async () => {
  const ipc = {
    sendAndTransfer: jest.fn(() => {
      throw new TypeError(`x is not a function`)
    }),
  }
  const port = {}
  await expect(TransferMessagePortMain.transferMessagePortMain(ipc, port)).rejects.toThrowError(
    new Error('Failed to send message port to utility process: TypeError: x is not a function')
  )
})
