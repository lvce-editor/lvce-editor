import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.clearAllMocks()
  IsTest.state.isTest = true
  for (const key in Preferences.state) {
    delete Preferences.state[key]
  }
  ColorTheme.state.watchedTheme = ''
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Css/Css.js', () => ({
  addCssStyleSheet: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ErrorHandling/ErrorHandling.js', () => ({
  handleError: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/GetColorThemeCss/GetColorThemeCss.js', () => ({
  getColorThemeCss: jest.fn((colorThemeId) => {
    if (colorThemeId === 'missing-theme') {
      throw new Error('Color theme not found')
    }
    return `:root { --theme-id: "${colorThemeId}"; }`
  }),
}))

jest.unstable_mockModule('../src/parts/GetColorThemeNames/GetColorThemeNames.js', () => ({
  getColorThemeNames: jest.fn(async () => ['cobalt2', 'slime']),
}))

const ColorTheme = await import('../src/parts/ColorTheme/ColorTheme.js')
const Command = await import('../src/parts/Command/Command.js')
const Css = await import('../src/parts/Css/Css.js')
const ErrorHandling = await import('../src/parts/ErrorHandling/ErrorHandling.js')
const GetColorThemeCss = await import('../src/parts/GetColorThemeCss/GetColorThemeCss.js')
const GetColorThemeNames = await import('../src/parts/GetColorThemeNames/GetColorThemeNames.js')
const IsTest = await import('../src/parts/IsTest/IsTest.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')

test('reload applies slime when no color theme is selected', async () => {
  await ColorTheme.reload()

  expect(GetColorThemeNames.getColorThemeNames).not.toHaveBeenCalled()
  expect(GetColorThemeCss.getColorThemeCss).toHaveBeenCalledWith('slime')
  expect(Css.addCssStyleSheet).toHaveBeenCalledWith('ContributedColorTheme', ':root { --theme-id: "slime"; }')
})

test('reload switches to slime when the selected color theme is no longer contributed', async () => {
  Preferences.state['workbench.colorTheme'] = 'disabled-theme'

  await ColorTheme.reload()

  expect(GetColorThemeCss.getColorThemeCss).not.toHaveBeenCalledWith('disabled-theme')
  expect(GetColorThemeCss.getColorThemeCss).toHaveBeenCalledWith('slime')
  expect(Preferences.state['workbench.colorTheme']).toBe('slime')
  expect(Command.execute).toHaveBeenCalledWith('Layout.handleColorThemeChanged', 'slime')
})

test('hydrate falls back to slime when the selected color theme cannot be loaded', async () => {
  Preferences.state['workbench.colorTheme'] = 'missing-theme'

  await ColorTheme.hydrate()

  expect(GetColorThemeCss.getColorThemeCss).toHaveBeenNthCalledWith(1, 'missing-theme')
  expect(GetColorThemeCss.getColorThemeCss).toHaveBeenNthCalledWith(2, 'slime')
  expect(ErrorHandling.handleError).toHaveBeenCalledTimes(1)
  expect(Css.addCssStyleSheet).toHaveBeenCalledWith('ContributedColorTheme', ':root { --theme-id: "slime"; }')
})

test('setColorTheme notifies viewlets when the color theme changes', async () => {
  await ColorTheme.setColorTheme('cobalt2')

  expect(Preferences.state['workbench.colorTheme']).toBe('cobalt2')
  expect(Command.execute).toHaveBeenCalledWith('Layout.handleColorThemeChanged', 'cobalt2')
})

test('setColorTheme does not notify viewlets when applying the color theme fails', async () => {
  await ColorTheme.setColorTheme('missing-theme')

  expect(Command.execute).not.toHaveBeenCalled()
})
