import { jest } from '@jest/globals'
import * as ModuleId from '../src/parts/ModuleId/ModuleId.js'
import * as Preferences from '../src/parts/Preferences/Preferences.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/ErrorHandling/ErrorHandling.js', () => {
  return {
    handleError: jest.fn(() => {}),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')

const ColorTheme = await import('../src/parts/ColorTheme/ColorTheme.js')
const Command = await import('../src/parts/Command/Command.js')
const ErrorHandling = await import('../src/parts/ErrorHandling/ErrorHandling.js')

beforeAll(() => {
  Command.setLoad((moduleId) => {
    switch (moduleId) {
      case ModuleId.ColorThemeFromJson:
        return import('../src/parts/ColorThemeFromJson/ColorThemeFromJson.ipc.js')
      default:
        throw new Error(`module not found ${moduleId}`)
    }
  })
})

test('hydrate', async () => {
  Preferences.state['workbench.colorTheme'] = 'slime'
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionHost.getColorThemeJson':
        const colorThemeId = params[0]
        switch (colorThemeId) {
          case 'slime':
            return {
              type: 'dark',
              colors: {
                ActivityBarBackground: 'rgb(41, 48, 48)',
                ActivityBarForeground: 'rgba(135, 143, 140, 0.4)',
              },
              tokenColors: [],
            }
        }
      default:
        throw new Error('unexpected message (2)')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})

  await ColorTheme.hydrate()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ExtensionHost.getColorThemeJson', 'slime')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Css.setInlineStyle',
    'ContributedColorTheme',
    `:root {
  --ActivityBarBackground: rgb(41, 48, 48);
  --ActivityBarForeground: rgba(135, 143, 140, 0.4);
  --ActivityBarInactiveForeground: rgba(135, 143, 140, 0.4);
  --CssVariableName: undefined;
}



`
  )
})

test('hydrate - color theme fails to load from shared process', async () => {
  Preferences.state['workbench.colorTheme'] = 'atom-one-dark'
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionHost.getColorThemeJson':
        const colorThemeId = params[0]
        switch (colorThemeId) {
          case 'atom-one-dark':
            throw new Error('Color theme "atom-one-dark" not found in extensions folder')
          case 'slime':
            return {
              type: 'dark',
              colors: {
                ActivityBarBackground: 'rgb(41, 48, 48)',
                ActivityBarForeground: 'rgba(135, 143, 140, 0.4)',
              },
              tokenColors: [],
            }
          default:
            throw new Error('unexpected message (1)')
        }
      default:
        throw new Error('unexpected message (2)')
    }
  })
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  await ColorTheme.hydrate()
  expect(ErrorHandling.handleError).toHaveBeenCalledTimes(1)
  expect(ErrorHandling.handleError).toHaveBeenCalledWith(
    new Error('Failed to apply color theme "atom-one-dark": Color theme "atom-one-dark" not found in extensions folder')
  )
})

// TODO in case of this fatal error, it should prompt the user to check the extensions folder
// or something more useful
test('hydrate - color theme fails to load and fallback color theme also fails to load', async () => {
  Preferences.state['workbench.colorTheme'] = 'atom-one-dark'
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionHost.getColorThemeJson':
        const colorThemeId = params[0]
        switch (colorThemeId) {
          case 'atom-one-dark':
            throw new Error('Color theme "atom-one-dark" not found in extensions folder')
          case 'slime':
            throw new Error('Color theme "slime" not found in extensions folder')
          default:
            throw new Error('unexpected message (1)')
        }
      default:
        throw new Error('unexpected message (2)')
    }
  })
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  await expect(ColorTheme.hydrate()).rejects.toThrowError(
    new Error('Failed to apply color theme "slime": Color theme "slime" not found in extensions folder')
  )
  expect(ErrorHandling.handleError).toHaveBeenCalledTimes(1)
  expect(ErrorHandling.handleError).toHaveBeenNthCalledWith(
    1,
    new Error('Failed to apply color theme "atom-one-dark": Color theme "atom-one-dark" not found in extensions folder')
  )
})

test('hydrate - color id is fallback color theme id and fails to load', async () => {
  Preferences.state['workbench.colorTheme'] = 'slime'
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionHost.getColorThemeJson':
        const colorThemeId = params[0]
        switch (colorThemeId) {
          case 'slime':
            throw new Error('Color theme "slime" not found in extensions folder')
        }
      default:
        throw new Error('unexpected message (2)')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  await expect(ColorTheme.hydrate()).rejects.toThrowError(
    new Error('Failed to apply color theme "slime": Color theme "slime" not found in extensions folder')
  )
  expect(spy).not.toHaveBeenCalled()
})

test('setColorTheme - error', () => {
  // TODO should show error message
})

// TODO what if color theme cannot be loaded because of invalid extension json?
// handle that error case
