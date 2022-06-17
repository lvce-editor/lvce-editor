import { jest } from '@jest/globals'
import * as Dialog from '../src/parts/Dialog/Dialog.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as Platform from '../src/parts/Platform/Platform.js'

// TODO would need to test different platforms

beforeEach(() => {
  Dialog.state.dialog = undefined
})

test.skip('openFolder', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    if (message.method === 8307) {
      SharedProcess.state.receive({
        jsonrpc: '2.0',
        id: message.id,
        result: ['/tmp/some-folder'],
      })
    } else {
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
  await Dialog.openFolder()
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    id: expect.any(Number),
    method: 8307,
    params: [],
  })
})

test('showAbout - electron', async () => {
  Platform.state.getPlatform = () => {
    return 'electron'
  }
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Electron.about':
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
  await Dialog.showAbout()
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    id: expect.any(Number),
    method: 'Electron.about',
    params: [],
  })
})

// TODO what if showErrorMessage results in error?
// Then showing error message would result in endless loop
// be careful and add test

test('showMessage - web', async () => {
  Platform.state.getPlatform = () => {
    return 'web'
  }
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
  await Dialog.showMessage(
    {
      message: 'Error: Oops',
      codeFrame: '',
      stack: '',
    },
    []
  )
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    7835,
    {
      message: 'Error: Oops',
      codeFrame: '',
      stack: '',
    },
    [],
  ])
})

test('showMessage - electron', async () => {
  Platform.state.getPlatform = () => {
    return 'electron'
  }
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Electron.showMessageBox':
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
  await Dialog.showMessage(
    {
      message: 'Error: Oops',
      codeFrame: '',
      stack: '',
    },
    []
  )
  expect(Dialog.state.dialog).toEqual({
    message: { codeFrame: '', message: 'Error: Oops', stack: '' },
    options: [],
  })
})

test('close - web', async () => {
  Platform.state.getPlatform = () => {
    return 'web'
  }
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
  await Dialog.showMessage(
    {
      message: 'Error: Oops',
      codeFrame: '',
      stack: '',
    },
    []
  )
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
  await Dialog.close()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    7836,
  ])
})
