import { jest } from '@jest/globals'
import * as ExtensionHostSourceControl from '../src/parts/ExtensionHost/ExtensionHostSourceControl.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as ExtensionHost from '../src/parts/ExtensionHost/ExtensionHostCore.js'

beforeAll(() => {
  ExtensionHost.state.status = ExtensionHost.STATUS_RUNNING
})

test('acceptInput', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.sourceControlAcceptInput':
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
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  expect(await ExtensionHostSourceControl.acceptInput('')).toBeUndefined()
})

test('acceptInput - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.sourceControlAcceptInput':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: [],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(ExtensionHostSourceControl.acceptInput()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

// TODO test getChangedFiles

// TODO test getFileBefore
