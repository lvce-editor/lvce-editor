import { jest } from '@jest/globals'
import * as ColorTheme from '../src/parts/ColorTheme/ColorTheme.js'
import * as Preferences from '../src/parts/Preferences/Preferences.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

beforeEach(() => {
  jest.resetAllMocks()
})

test('hydrate', async () => {
  Preferences.state['workbench.colorTheme'] = 'slime'
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.getColorThemeJson':
        const colorThemeId = message.params[0]
        switch (colorThemeId) {
          case 'slime':
            SharedProcess.state.receive({
              id: message.id,
              jsonrpc: '2.0',
              result: {
                type: 'dark',
                colors: {
                  ActivityBarBackground: 'rgb(41, 48, 48)',
                  ActivityBarForeground: 'rgba(135, 143, 140, 0.4)',
                },
                tokenColors: [],
              },
            })
            break
          default:
            throw new Error('unexpected message (1)')
        }
        break
      default:
        throw new Error('unexpected message (2)')
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
  await ColorTheme.hydrate()
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'ExtensionHost.getColorThemeJson',
    params: ['slime'],
  })
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    4,
    4551,
    'ContributedColorTheme',
    `:root {
  --ActivityBarBackground: rgb(41, 48, 48);
  --ActivityBarForeground: rgba(135, 143, 140, 0.4);
  --ActivityBarInactiveForeground: rgba(135, 143, 140, 0.4);
}



`,
  ])
})

test('hydrate - color theme fails to load from shared process', async () => {
  Preferences.state['workbench.colorTheme'] = 'atom-one-dark'
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.getColorThemeJson':
        const colorThemeId = message.params[0]
        switch (colorThemeId) {
          case 'atom-one-dark':
            throw new Error(
              'Color theme "atom-one-dark" not found in extensions folder'
            )
          case 'slime':
            SharedProcess.state.receive({
              id: message.id,
              jsonrpc: '2.0',
              result: {
                type: 'dark',
                colors: {
                  ActivityBarBackground: 'rgb(41, 48, 48)',
                  ActivityBarForeground: 'rgba(135, 143, 140, 0.4)',
                },
                tokenColors: [],
              },
            })
            break
          default:
            throw new Error('unexpected message (1)')
        }
        break
      default:
        throw new Error('unexpected message (2)')
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
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  await ColorTheme.hydrate()
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    new Error(
      'Failed to apply color theme "atom-one-dark": Error: Color theme "atom-one-dark" not found in extensions folder'
    )
  )
})

// TODO in case of this fatal error, it should prompt the user to check the extensions folder
// or something more useful
test('hydrate - color theme fails to load and fallback color theme also fails to load', async () => {
  Preferences.state['workbench.colorTheme'] = 'atom-one-dark'
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.getColorThemeJson':
        const colorThemeId = message.params[0]
        switch (colorThemeId) {
          case 'atom-one-dark':
            throw new Error(
              'Color theme "atom-one-dark" not found in extensions folder'
            )
          case 'slime':
            throw new Error(
              'Color theme "slime" not found in extensions folder'
            )
          default:
            throw new Error('unexpected message (1)')
        }
      default:
        throw new Error('unexpected message (2)')
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
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  await expect(ColorTheme.hydrate()).rejects.toThrowError(
    new Error(
      'Failed to apply color theme "slime": Error: Color theme "slime" not found in extensions folder'
    )
  )
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    new Error(
      'Failed to apply color theme "atom-one-dark": Error: Color theme "atom-one-dark" not found in extensions folder'
    )
  )
})

test('hydrate - color id is fallback color theme id and fails to load', async () => {
  Preferences.state['workbench.colorTheme'] = 'slime'
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.getColorThemeJson':
        const colorThemeId = message.params[0]
        switch (colorThemeId) {
          case 'slime':
            throw new Error(
              'Color theme "slime" not found in extensions folder'
            )
          default:
            throw new Error('unexpected message (1)')
        }
      default:
        throw new Error('unexpected message (2)')
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
        throw new Error('unexpected message (3)')
    }
  })
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  await expect(ColorTheme.hydrate()).rejects.toThrowError(
    new Error(
      'Failed to apply color theme "slime": Error: Color theme "slime" not found in extensions folder'
    )
  )
  expect(spy).not.toHaveBeenCalled()
})

test('setColorTheme - error', () => {
  // TODO should show error message
})

// TODO what if color theme cannot be loaded because of invalid extension json?
// handle that error case
