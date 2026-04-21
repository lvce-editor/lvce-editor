import { afterEach, expect, jest, test } from '@jest/globals'

afterEach(() => {
  jest.restoreAllMocks()
})

jest.unstable_mockModule('../src/parts/AppWindow/AppWindow.js', () => ({
  createAppWindow: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  getAllSafe: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/PreloadUrl/PreloadUrl.js', () => ({
  getPreloadUrl: jest.fn(() => 'file:///preload.js'),
}))

const AppWindow = await import('../src/parts/AppWindow/AppWindow.js')
const HandleElectronReady = await import('../src/parts/HandleElectronReady/HandleElectronReady.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')

test('handleElectronReady - uses safe preferences when creating the app window', async () => {
  // @ts-ignore
  Preferences.getAllSafe.mockResolvedValue({ 'workbench.colorTheme': 'slime' })

  await HandleElectronReady.handleElectronReady({}, '/tmp')

  expect(AppWindow.createAppWindow).toHaveBeenCalledTimes(1)
  expect(AppWindow.createAppWindow).toHaveBeenCalledWith({
    preferences: {
      'workbench.colorTheme': 'slime',
    },
    parsedArgs: {},
    workingDirectory: '/tmp',
    preloadUrl: 'file:///preload.js',
  })
})
