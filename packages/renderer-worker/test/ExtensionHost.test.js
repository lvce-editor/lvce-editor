import { jest } from '@jest/globals'
import * as ExtensionHost from '../src/parts/ExtensionHost/ExtensionHostCore.js'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'

beforeEach(() => {
  ExtensionHost.state.runningExtensions = []
  ExtensionHost.state.status = 0
  ExtensionHost.state.readyCallbacks = []
})

test.skip('start', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: null,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: [],
        })
        break
      case 'ExtensionHost.setWorkspaceRoot':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: null,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ExtensionHost.start()
  expect(SharedProcess.state.send).toHaveBeenCalledTimes(3)
  expect(SharedProcess.state.send).toHaveBeenNthCalledWith(1, {
    id: expect.any(Number),
    jsonrpc: JsonRpcVersion.Two,
    method: 'ExtensionHost.start',
    params: [],
  })
  expect(SharedProcess.state.send).toHaveBeenNthCalledWith(3, {
    id: expect.any(Number),
    jsonrpc: JsonRpcVersion.Two,
    method: 'ExtensionManagement.getExtensions',
    params: [],
  })
})

test.skip('start - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(ExtensionHost.start()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test.skip('activateByEvent', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 416:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: null,
        })
        break
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: null,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: [
            {
              main: 'main.js',
            },
          ],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ExtensionHost.activateByEvent('onFileSystem:memfs')
  expect(SharedProcess.state.send).toHaveBeenCalledTimes(4)
  expect(SharedProcess.state.send).toHaveBeenNthCalledWith(3, {
    id: expect.any(Number),
    jsonrpc: JsonRpcVersion.Two,
    method: 416,
    params: [
      {
        id: undefined,
        main: 'main.js',
        path: undefined,
      },
    ],
  })
})

test.skip('activateByEvent - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 416:
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: [
            {
              main: 'main.js',
            },
          ],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    ExtensionHost.activateByEvent('onFileSystem:memfs')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
