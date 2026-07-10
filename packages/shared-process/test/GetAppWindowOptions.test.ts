import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ExtensionManagement/ExtensionManagementColorTheme.js', () => ({
  getColorThemeJson: jest.fn(),
}))

const ExtensionManagementColorTheme = await import('../src/parts/ExtensionManagement/ExtensionManagementColorTheme.js')
const GetAppWindowOptions = await import('../src/parts/GetAppWindowOptions/GetAppWindowOptions.js')

const getOptions = (preferences: any): any => {
  return GetAppWindowOptions.getAppWindowOptions({
    preferences: {
      'window.controlsOverlay.enabled': true,
      'window.titleBarStyle': 'custom',
      ...preferences,
    },
    preloadUrl: 'file:///preload.js',
    screenHeight: 900,
    screenWidth: 1600,
  })
}

test('getAppWindowOptions - uses active color theme for native title bar overlay', async () => {
  // @ts-ignore
  ExtensionManagementColorTheme.getColorThemeJson.mockResolvedValue({
    colors: {
      MainBackground: '#101820',
      TitleBarActiveBackground: '#303840',
      TitleBarBackground: '#202830',
      TitleBarForeground: '#a0a8b0',
      TitleBarForegroundActive: '#f0f8ff',
    },
  })

  await expect(getOptions({ 'workbench.colorTheme': 'test-theme' })).resolves.toMatchObject({
    backgroundColor: '#101820',
    titleBarOverlay: {
      color: '#303840',
      height: 29,
      symbolColor: '#f0f8ff',
    },
  })
  expect(ExtensionManagementColorTheme.getColorThemeJson).toHaveBeenCalledWith('test-theme')
})

test('getAppWindowOptions - falls back when color theme cannot be loaded', async () => {
  // @ts-ignore
  ExtensionManagementColorTheme.getColorThemeJson.mockRejectedValue(new Error('theme not found'))

  await expect(getOptions({ 'workbench.colorTheme': 'missing-theme' })).resolves.toMatchObject({
    backgroundColor: '#1e2324',
    titleBarOverlay: {
      color: '#1e2324',
      height: 29,
      symbolColor: '#74b1be',
    },
  })
})

test('getAppWindowOptions - supports older title bar color keys', async () => {
  // @ts-ignore
  ExtensionManagementColorTheme.getColorThemeJson.mockResolvedValue({
    colors: {
      MainBackground: '#111111',
      TitleBarBackground: '#222222',
      TitleBarColor: '#dddddd',
    },
  })

  await expect(getOptions({ 'workbench.colorTheme': 'legacy-theme' })).resolves.toMatchObject({
    backgroundColor: '#111111',
    titleBarOverlay: {
      color: '#222222',
      symbolColor: '#dddddd',
    },
  })
})
