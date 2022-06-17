import { jest } from '@jest/globals'
import * as ExtensionHost from '../src/parts/ExtensionHost/ExtensionHostCore.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

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
          jsonrpc: '2.0',
          result: null,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: [],
        })
        break
      case 'ExtensionHost.setWorkspaceRoot':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  await ExtensionHost.start()
  expect(SharedProcess.state.send).toHaveBeenCalledTimes(3)
  expect(SharedProcess.state.send).toHaveBeenNthCalledWith(1, {
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'ExtensionHost.start',
    params: [],
  })
  expect(SharedProcess.state.send).toHaveBeenNthCalledWith(3, {
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'ExtensionManagement.getExtensions',
    params: [],
  })
})

test.skip('start - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
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
          jsonrpc: '2.0',
          result: null,
        })
        break
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: [
            {
              main: 'main.js',
            },
          ],
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  await ExtensionHost.activateByEvent('onFileSystem:memfs')
  expect(SharedProcess.state.send).toHaveBeenCalledTimes(4)
  expect(SharedProcess.state.send).toHaveBeenNthCalledWith(3, {
    id: expect.any(Number),
    jsonrpc: '2.0',
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
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: [
            {
              main: 'main.js',
            },
          ],
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  await expect(
    ExtensionHost.activateByEvent('onFileSystem:memfs')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
