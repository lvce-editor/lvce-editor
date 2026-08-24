import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

const addEventListener = jest.fn()
const removeEventListener = jest.fn()
const watcher = {
  addEventListener,
  removeEventListener,
}
const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})

jest.unstable_mockModule('../src/parts/FileWatcher/FileWatcher.js', () => ({
  dispose: jest.fn(),
  watch: jest.fn(() => watcher),
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: jest.fn(() => PlatformType.Electron),
}))

jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.js', () => ({
  getUserSettingsPath: jest.fn(() => '/home/test/.config/lvce/settings.json'),
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  reload: jest.fn(),
}))

const FileWatcher = await import('../src/parts/FileWatcher/FileWatcher.js')
const Platform = await import('../src/parts/Platform/Platform.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')
const PreferencesFileWatcher = await import('../src/parts/PreferencesFileWatcher/PreferencesFileWatcher.js')

beforeEach(async () => {
  jest.useFakeTimers()
  await PreferencesFileWatcher.dispose()
  jest.clearAllMocks()
  consoleWarn.mockImplementation(() => {})
  // @ts-ignore
  Platform.getPlatform.mockReturnValue(PlatformType.Electron)
  // @ts-ignore
  FileWatcher.watch.mockResolvedValue(watcher)
})

afterEach(() => {
  jest.useRealTimers()
})

test('hydrate watches the user settings directory', async () => {
  await PreferencesFileWatcher.hydrate()

  expect(FileWatcher.watch).toHaveBeenCalledWith({
    exclude: [],
    roots: ['file:///home/test/.config/lvce'],
  })
  expect(addEventListener).toHaveBeenCalledWith('watcher-event', expect.any(Function))
})

test('hydrate skips the web platform', async () => {
  // @ts-ignore
  Platform.getPlatform.mockReturnValue(PlatformType.Web)

  await PreferencesFileWatcher.hydrate()

  expect(FileWatcher.watch).not.toHaveBeenCalled()
})

test('hydrate handles watcher setup errors', async () => {
  const error = new Error('ENOENT')
  // @ts-ignore
  FileWatcher.watch.mockRejectedValue(error)

  await expect(PreferencesFileWatcher.hydrate()).resolves.toBeUndefined()

  expect(consoleWarn).toHaveBeenCalledWith('Failed to watch user settings: Error: ENOENT')
})

test('settings file changes reload preferences after a debounce', async () => {
  await PreferencesFileWatcher.hydrate()
  const handleEvent = addEventListener.mock.calls[0][1] as (event: any) => void

  handleEvent({
    detail: {
      eventName: 'change',
      uri: 'file:///home/test/.config/lvce/settings.json',
    },
  })
  expect(Preferences.reload).not.toHaveBeenCalled()

  await jest.runAllTimersAsync()

  expect(Preferences.reload).toHaveBeenCalledTimes(1)
})

test('settings file changes are debounced', async () => {
  await PreferencesFileWatcher.hydrate()
  const handleEvent = addEventListener.mock.calls[0][1] as (event: any) => void

  handleEvent({ detail: { eventName: 'unlink', uri: 'file:///home/test/.config/lvce/settings.json' } })
  handleEvent({ detail: { eventName: 'add', uri: 'file:///home/test/.config/lvce/settings.json' } })
  handleEvent({ detail: { eventName: 'change', uri: 'file:///home/test/.config/lvce/settings.json' } })
  await jest.runAllTimersAsync()

  expect(Preferences.reload).toHaveBeenCalledTimes(1)
})

test('changes to other files are ignored', async () => {
  await PreferencesFileWatcher.hydrate()
  const handleEvent = addEventListener.mock.calls[0][1] as (event: any) => void

  handleEvent({
    detail: {
      eventName: 'change',
      uri: 'file:///home/test/.config/lvce/keybindings.json',
    },
  })
  await jest.runAllTimersAsync()

  expect(Preferences.reload).not.toHaveBeenCalled()
})

test('dispose stops watching and cancels a pending reload', async () => {
  await PreferencesFileWatcher.hydrate()
  const handleEvent = addEventListener.mock.calls[0][1] as (event: any) => void
  handleEvent({ detail: { eventName: 'change', uri: 'file:///home/test/.config/lvce/settings.json' } })

  await PreferencesFileWatcher.dispose()
  await jest.runAllTimersAsync()

  expect(removeEventListener).toHaveBeenCalledWith('watcher-event', expect.any(Function))
  expect(FileWatcher.dispose).toHaveBeenCalledWith(watcher)
  expect(Preferences.reload).not.toHaveBeenCalled()
})
