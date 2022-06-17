import { jest } from '@jest/globals'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as Workspace from '../src/parts/Workspace/Workspace.js'
import * as GlobalEventBus from '../src/parts/GlobalEventBus/GlobalEventBus.js'

test('hydrate', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Workspace.resolveRoot':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: {
            path: '/tmp/some-folder',
            homeDir: '~',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await Workspace.hydrate()
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    id: expect.any(Number),
    method: 'Workspace.resolveRoot',
    params: [],
  })
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(2)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(2, [
    909090,
    expect.any(Number),
    8085,
    '/tmp/some-folder',
  ])
})

test('hydrate - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Workspace.resolveRoot':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  // TODO should handle error gracefully
  await expect(Workspace.hydrate()).rejects.toThrowError(
    new Error('x is not a function')
  )
})

test.skip('setPath', async () => {
  const listener = jest.fn()
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  GlobalEventBus.addListener('workspace.change', listener)
  await Workspace.setPath('/test')
  expect(listener).toBeCalledTimes(1)
  expect(listener).toHaveBeenCalledWith('/test')
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    8085,
    '/test',
  ])
})

test.skip('pathBaseName - linux', () => {
  Workspace.state.pathSeparator = '/'
  expect(Workspace.pathBaseName('/test/file.txt')).toBe('file.txt')
})

test.skip('pathBaseName - windows', () => {
  Workspace.state.pathSeparator = '\\'
  expect(Workspace.pathBaseName('\\test\\file.txt')).toBe('file.txt')
})
