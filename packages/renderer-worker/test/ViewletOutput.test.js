import { jest } from '@jest/globals'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as ViewletOutput from '../src/parts/Viewlet/ViewletOutput.js'

test('name', () => {
  expect(ViewletOutput.name).toBe('Output')
})

test('create', () => {
  const state = ViewletOutput.create()
  expect(state).toBeDefined()
})

test.skip('loadContent', async () => {
  const state = ViewletOutput.create()
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'OutputChannel.open':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: undefined,
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
  expect(await ViewletOutput.loadContent(state)).toEqual({})
  expect(SharedProcess.state.send).toHaveBeenCalledTimes(1)
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'OutputChannel.open',
    params: [0, '/tmp/log-shared-process.txt'],
  })
})

test.skip('contentLoaded', async () => {
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
  const state = {
    ...ViewletOutput.create(),
    options: [
      {
        file: '/tmp/log-shared-process.txt',
        name: 'Shared Process',
      },
      {
        file: '/tmp/log-extension-host.txt',
        name: 'Extension Host',
      },
    ],
    index: 0,
  }
  await ViewletOutput.contentLoaded(state)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    3024,
    'Output',
    'setOptions',
    [
      {
        file: '/tmp/log-shared-process.txt',
        name: 'Shared Process',
      },
      {
        file: '/tmp/log-extension-host.txt',
        name: 'Extension Host',
      },
    ],
    -1,
  ])
})

test('setOutputChannel', async () => {
  const state = ViewletOutput.create()
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'OutputChannel.open':
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
  await ViewletOutput.setOutputChannel(state, '/tmp/log-extension-host.txt')
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 'OutputChannel.open',
    params: ['Output', '/tmp/log-extension-host.txt'],
    id: expect.any(Number),
  })
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'Output',
    'clear',
  ])
})

test('dispose', async () => {
  const state = ViewletOutput.create()
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'OutputChannel.close':
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
  await ViewletOutput.dispose(state)
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 'OutputChannel.close',
    id: expect.any(Number),
    params: ['Output'],
  })
})

test('handleError', () => {
  const state = ViewletOutput.create()
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  ViewletOutput.handleError(
    state,
    new Error(`ENOENT: no such file or directory, access '/tmp/log-main.txt'`)
  )
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    new Error(`ENOENT: no such file or directory, access '/tmp/log-main.txt'`)
  )
})
