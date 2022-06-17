import { jest } from '@jest/globals'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as Window from '../src/parts/Window/Window.js'
import * as Platform from '../src/parts/Platform/Platform.js'

// TODO test for platform web and platform electron
test.skip('reload', () => {
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
  Window.reload()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([8080])
})

test('minimize', () => {
  SharedProcess.state.send = jest.fn()
  Window.minimize()
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 'Electron.windowMinimize',
    params: [],
  })
})

test('maximize', () => {
  SharedProcess.state.send = jest.fn()
  Window.maximize()
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 'Electron.windowMaximize',
    params: [],
  })
})

test('unmaximize', () => {
  SharedProcess.state.send = jest.fn()
  Window.unmaximize()
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 'Electron.windowUnMaximize',
    params: [],
  })
})

test('close', () => {
  SharedProcess.state.send = jest.fn()
  Window.close()
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 'Electron.windowClose',
    params: [],
  })
})

test('setTitle', async () => {
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
  await Window.setTitle('test')
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    8085,
    'test',
  ])
})

test('openNew - web', async () => {
  Platform.state.getPlatform = () => {
    return 'web'
  }
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      default:
        throw new Error('unexpected message')
    }
  })
  await Window.openNew()
  expect(SharedProcess.state.send).not.toHaveBeenCalled()
})

test('openNew - electron', async () => {
  Platform.state.getPlatform = () => {
    return 'electron'
  }
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Electron.windowOpenNew':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
      default:
        throw new Error('unexpected message')
    }
  })
  await Window.openNew()
  expect(SharedProcess.state.send).toHaveBeenCalledTimes(1)
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'Electron.windowOpenNew',
    params: [],
  })
})
