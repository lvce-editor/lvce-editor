import { beforeEach, expect, jest, test } from '@jest/globals'

const addEventListener = jest.fn()
const watcher = {
  addEventListener,
}
const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})

jest.unstable_mockModule('../src/parts/Css/Css.js', () => {
  return {
    reload: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/FileWatcher/FileWatcher.js', () => {
  return {
    watch: jest.fn(() => watcher),
  }
})

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => {
  return {
    get: jest.fn(() => true),
  }
})

jest.unstable_mockModule('../src/parts/Reload/Reload.js', () => {
  return {
    reload: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => 'file:///test/root'),
  }
})

const DevelopFileWatcher = await import('../src/parts/DevelopFileWatcher/DevelopFileWatcher.js')
const FileWatcher = await import('../src/parts/FileWatcher/FileWatcher.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')

beforeEach(() => {
  jest.clearAllMocks()
  consoleWarn.mockImplementation(() => {})
  // @ts-ignore
  Preferences.get.mockImplementation(() => true)
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => 'file:///test/root')
  // @ts-ignore
  FileWatcher.watch.mockImplementation(() => watcher)
})

test('hydrate - disabled preference', async () => {
  // @ts-ignore
  Preferences.get.mockImplementation(() => false)
  await DevelopFileWatcher.hydrate()
  expect(Preferences.get).toHaveBeenCalledWith('develop.fileWatcher')
  expect(SharedProcess.invoke).not.toHaveBeenCalled()
  expect(FileWatcher.watch).not.toHaveBeenCalled()
})

test('hydrate - watches development files', async () => {
  await DevelopFileWatcher.hydrate()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Platform.getRootUri')
  expect(FileWatcher.watch).toHaveBeenCalledTimes(1)
  expect(FileWatcher.watch).toHaveBeenCalledWith({
    roots: ['file:///test/root/static', 'file:///test/root/packages/renderer-worker/src'],
    exclude: ['node_modules', 'dist', '.tmp'],
  })
  expect(addEventListener).toHaveBeenCalledTimes(1)
  expect(addEventListener).toHaveBeenCalledWith('watcher-event', expect.any(Function))
})

test('hydrate - warns when watcher setup fails', async () => {
  const error = new Error('ENOSPC')
  // @ts-ignore
  FileWatcher.watch.mockImplementation(async () => {
    throw error
  })
  await expect(DevelopFileWatcher.hydrate()).resolves.toBeUndefined()
  expect(consoleWarn).toHaveBeenCalledTimes(1)
  expect(consoleWarn).toHaveBeenCalledWith('Failed to watch Error: ENOSPC')
})
