beforeEach(() => {
  jest.resetAllMocks()
})

jest.mock('electron', () => {
  return {
    autoUpdater: {
      setFeedURL: jest.fn(),
      quitAndInstall: jest.fn(),
      checkForUpdates: jest.fn(),
    },
  }
})

const electron = require('electron')
const ElectronAutoUpdater = require('../src/parts/ElectronAutoUpdater/ElectronAutoUpdater.js')

test('setFeedUrl - error', () => {
  // @ts-ignore
  electron.autoUpdater.setFeedURL.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  expect(() =>
    ElectronAutoUpdater.setFeedUrl({ url: 'https://example.com' })
  ).toThrowError(new TypeError('x is not a function'))
})

test('setFeedUrl', () => {
  // @ts-ignore
  electron.autoUpdater.setFeedURL.mockImplementation(() => {})
  ElectronAutoUpdater.setFeedUrl({ url: 'https://example.com' })
  expect(electron.autoUpdater.setFeedURL).toHaveBeenCalledTimes(1)
  expect(electron.autoUpdater.setFeedURL).toHaveBeenCalledWith({
    url: 'https://example.com',
  })
})

test('quitAndInstall - error', () => {
  // @ts-ignore
  electron.autoUpdater.quitAndInstall.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  expect(() => ElectronAutoUpdater.quitAndInstall()).toThrowError(
    new TypeError('x is not a function')
  )
})

test('quitAndInstall', () => {
  // @ts-ignore
  electron.autoUpdater.quitAndInstall.mockImplementation(() => {})
  ElectronAutoUpdater.quitAndInstall()
  expect(electron.autoUpdater.quitAndInstall).toHaveBeenCalledTimes(1)
  expect(electron.autoUpdater.quitAndInstall).toHaveBeenCalledWith()
})

test('checkForUpdates - error', () => {
  // @ts-ignore
  electron.autoUpdater.checkForUpdates.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  expect(() => ElectronAutoUpdater.checkForUpdates()).toThrowError(
    new TypeError('x is not a function')
  )
})

test('checkForUpdates', () => {
  // @ts-ignore
  electron.autoUpdater.checkForUpdates.mockImplementation(() => {})
  ElectronAutoUpdater.checkForUpdates()
  expect(electron.autoUpdater.checkForUpdates).toHaveBeenCalledTimes(1)
  expect(electron.autoUpdater.checkForUpdates).toHaveBeenCalledWith()
})
