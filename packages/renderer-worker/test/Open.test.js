import { jest } from '@jest/globals'
import * as Open from '../src/parts/Open/Open.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'

test('openNativeFolder', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Native.openFolder':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await Open.openNativeFolder('/test/my-folder')
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'Native.openFolder',
    params: ['/test/my-folder'],
  })
})

test('openNativeFolder - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Native.openFolder':
        SharedProcess.state.receive({
          id: message.id,
          error: {
            message: 'x is not a function',
            data: 'x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(Open.openNativeFolder('abc')).rejects.toThrowError(
    new Error('x is not a function')
  )
})
