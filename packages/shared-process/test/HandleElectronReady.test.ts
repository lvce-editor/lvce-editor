import { afterEach, expect, jest, test } from '@jest/globals'

afterEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/AppWindow/AppWindow.js', () => ({
  createAppWindow: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  getAllSafe: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => ({
  error: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Process/Process.js', () => ({
  exit: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/PreloadUrl/PreloadUrl.js', () => ({
  getPreloadUrl: jest.fn(() => 'file:///preload.js'),
}))

jest.unstable_mockModule('../src/parts/TransientLinkedExtensions/TransientLinkedExtensions.js', () => ({
  validate: jest.fn(() => {}),
}))

const AppWindow = await import('../src/parts/AppWindow/AppWindow.js')
const HandleElectronReady = await import('../src/parts/HandleElectronReady/HandleElectronReady.js')
const Logger = await import('../src/parts/Logger/Logger.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')
const Process = await import('../src/parts/Process/Process.js')
const TransientLinkedExtensions = await import('../src/parts/TransientLinkedExtensions/TransientLinkedExtensions.js')

test('handleElectronReady - uses safe preferences when creating the app window', async () => {
  // @ts-ignore
  Preferences.getAllSafe.mockResolvedValue({ 'workbench.colorTheme': 'slime' })

  await HandleElectronReady.handleElectronReady({}, '/tmp')

  expect(TransientLinkedExtensions.validate).toHaveBeenCalledTimes(1)
  expect(AppWindow.createAppWindow).toHaveBeenCalledTimes(1)
  expect(AppWindow.createAppWindow).toHaveBeenCalledWith({
    parsedArgs: {},
    preferences: {
      'workbench.colorTheme': 'slime',
    },
    preloadUrl: 'file:///preload.js',
    workingDirectory: '/tmp',
  })
})

test('handleElectronReady - exits with helpful error when transient link validation fails', async () => {
  const error = new Error('Failed to start: --link path does not exist: /tmp/missing')
  // @ts-ignore
  TransientLinkedExtensions.validate.mockRejectedValue(error)

  await HandleElectronReady.handleElectronReady({}, '/tmp')

  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(error)
  expect(Process.exit).toHaveBeenCalledTimes(1)
  expect(Process.exit).toHaveBeenCalledWith(128)
  expect(AppWindow.createAppWindow).not.toHaveBeenCalled()
})
