import * as TransferMessagePort from '../src/parts/TransferMessagePort/TransferMessagePort.js'
import { jest } from '@jest/globals'

test('transferMessagePort - error', async () => {
  const ipc = {
    sendAndTransfer: jest.fn(() => {
      throw new TypeError(`x is not a function`)
    }),
  }
  const port = {}
  await expect(TransferMessagePort.transferMessagePort(ipc, port)).rejects.toThrowError(
    new Error('Failed to send message port to worker thread: TypeError: x is not a function')
  )
})
