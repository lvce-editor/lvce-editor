import { jest } from '@jest/globals'
import * as ExtensionHostManagement from '../src/parts/ExtensionHost/ExtensionHostManagement.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'

beforeEach(() => {
  ExtensionHostManagement.state.pendingExtensions = Object.create(null)
  ExtensionHostManagement.state.runningExtensions = Object.create(null)
})

// TODO mock extension host

test.skip('activateExtension - called multiple times', async () => {
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
        throw new Error('unexpected message')
    }
  })
  const promise1 = ExtensionHostManagement.activateByEvent('onLanguage:test')
  const promise2 = ExtensionHostManagement.activateByEvent('onLanguage:test')
  const promise3 = ExtensionHostManagement.activateByEvent('onLanguage:test')

  let promise1Resolved = false
  let promise2Resolved = false
  let promise3Resolved = false

  await Promise.all([
    promise1.then(() => {
      expect(promise2Resolved).toBe(false)
      expect(promise3Resolved).toBe(false)
      promise1Resolved = true
    }),
    promise2.then(() => {
      expect(promise1Resolved).toBe(true)
      expect(promise3Resolved).toBe(false)
      promise2Resolved = true
    }),
    promise3.then(() => {
      expect(promise1Resolved).toBe(true)
      expect(promise2Resolved).toBe(true)
      promise3Resolved = true
    }),
  ])
})
