import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import { jest } from '@jest/globals'
import * as Platform from '../src/parts/Platform/Platform.js'

test('getLogsDir', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Platform.getLogsDir':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: '~/.local/state/app-name',
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  expect(await Platform.getLogsDir()).toBe('~/.local/state/app-name')
})

test('getLogsDir - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Platform.getLogsDir':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  await expect(Platform.getLogsDir()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('getUserSettingsPath', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Platform.getUserSettingsPath':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: '~/.config/app/settings.json',
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  expect(await Platform.getUserSettingsPath()).toBe(
    '~/.config/app/settings.json'
  )
})

test('getUserSettingsPath - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Platform.getUserSettingsPath':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  await expect(Platform.getUserSettingsPath()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})
