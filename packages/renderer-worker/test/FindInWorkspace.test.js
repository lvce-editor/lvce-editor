import * as FindInWorkspace from '../src/parts/FindInWorkspace/FindInWorkspace.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'

test('findInWorkspace', async () => {
  SharedProcess.state.send = (message) => {
    switch (message.method) {
      case 'Search.search':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: [],
        })
        break
      default:
        throw new Error('unexpected message')
    }
    console.log(message)
  }
  expect(await FindInWorkspace.findInWorkspace('test search')).toEqual([])
})

test.skip('findInWorkspace - error', async () => {
  SharedProcess.state.send = (message) => {
    switch (message.method) {
      case 'Search.search':
        // TODO should return error
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: [],
        })
        break
      default:
        throw new Error('unexpected message')
    }
    console.log(message)
  }
  expect(await FindInWorkspace.findInWorkspace('test search')).toEqual([])
})
