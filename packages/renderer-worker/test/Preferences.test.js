import { jest } from '@jest/globals'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'

const Main = {
  openUri: jest.fn(),
}

beforeEach(() => {
  for (const key in Preferences.state) {
    delete Preferences.state[key]
  }
})

jest.unstable_mockModule('../src/parts/Viewlet/ViewletMain.js', () => {
  return {
    openUri(uri) {
      Main.openUri(uri)
    },
  }
})

const Preferences = await import('../src/parts/Preferences/Preferences.js')

test.skip('openSettingsJson', async () => {
  RendererProcess.state.send = jest.fn()
  Main.openUri = jest.fn()
  await Preferences.openSettingsJson()
  expect(Main.openUri).toHaveBeenCalledTimes(1)
  expect(Main.openUri).toHaveBeenCalledWith('app://settings.json')
})

test.skip('openKeyBindingsJson', async () => {
  RendererProcess.state.send = jest.fn()
  Main.openUri = jest.fn()
  await Preferences.openKeyBindingsJson()
  expect(Main.openUri).toHaveBeenCalledTimes(1)
  expect(Main.openUri).toHaveBeenCalledWith('app://keyBindings.json')
})

test('hydrate', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Preferences.getAll':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: {
            'editor.fontSize': 14,
            'editor.fontFamily': "'Fira Code'",
          },
        })
        break
      default:
        console.log(message)
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
  await Preferences.hydrate()
  expect(Preferences.state).toEqual({
    'editor.fontSize': 14,
    'editor.fontFamily': "'Fira Code'",
  })
})

test('hydrate - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Preferences.getAll':
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
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  // TODO should handle error gracefully
  await expect(Preferences.hydrate()).rejects.toThrowError(
    new Error('x is not a function')
  )
})

test('get', () => {
  Object.assign(Preferences.state, { x: 42 })
  expect(Preferences.get('x')).toBe(42)
})

test('set', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Platform.getUserSettingsPath':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: '',
        })
        break
      case 'FileSystem.writeFile':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: null,
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })

  await Preferences.set('x', 42)
  expect(SharedProcess.state.send).toHaveBeenCalledTimes(2)
  expect(SharedProcess.state.send).toHaveBeenNthCalledWith(1, {
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'Platform.getUserSettingsPath',
    params: [],
  })
  expect(SharedProcess.state.send).toHaveBeenNthCalledWith(2, {
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'FileSystem.writeFile',
    params: [
      '',
      `{
  \"x\": 42
}
`,
    ],
  })
})

test('set - error - getUserSettingsPath', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Platform.getUserSettingsPath':
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
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  await expect(Preferences.set('x', 42)).rejects.toThrowError(
    new Error('x is not a function')
  )
})

test('set - error - writeFile', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Platform.getUserSettingsPath':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: '',
        })
        break
      case 'FileSystem.writeFile':
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
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  await expect(Preferences.set('x', 42)).rejects.toThrowError(
    new Error('Failed to write : x is not a function')
  )
})
