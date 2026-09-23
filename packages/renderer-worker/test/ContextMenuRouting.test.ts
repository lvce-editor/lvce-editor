/* eslint-disable jest/no-restricted-jest-methods -- routing tests need isolated ESM module mocks. */

import { beforeEach, expect, jest, test } from '@jest/globals'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

const platform = jest.fn(() => PlatformType.Remote)
const getPreference = jest.fn()

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: platform,
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  get: getPreference,
}))

jest.unstable_mockModule('../src/parts/ContextMenu/ContextMenuBrowser.js', () => ({
  show2: jest.fn(),
  show2Below: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ContextMenu/ContextMenuElectron.js', () => ({
  show2: jest.fn(),
  show2Below: jest.fn(),
}))

const Browser = await import('../src/parts/ContextMenu/ContextMenuBrowser.js')
const Electron = await import('../src/parts/ContextMenu/ContextMenuElectron.js')
const ContextMenu = await import('../src/parts/ContextMenu/ContextMenu.js')

beforeEach(() => {
  jest.resetAllMocks()
  platform.mockReturnValue(PlatformType.Remote)
  getPreference.mockReturnValue(undefined)
})

test('uses the native menu for Simple Browser tabs when enabled in Electron', async () => {
  platform.mockReturnValue(PlatformType.Electron)
  getPreference.mockReturnValue(true)

  await ContextMenu.show2(42, MenuEntryId.SimpleBrowserTab, 10, 20, 3)

  expect(Electron.show2).toHaveBeenCalledWith(42, MenuEntryId.SimpleBrowserTab, 10, 20, 3)
  expect(Browser.show2).not.toHaveBeenCalled()
})

test('uses the application menu for Simple Browser menus when native menus are disabled', async () => {
  platform.mockReturnValue(PlatformType.Electron)
  getPreference.mockImplementation((key) => (key === 'simpleBrowser.nativeContextMenu' ? false : 'native'))

  await ContextMenu.show2Below(42, MenuEntryId.SimpleBrowserToolbar, 10, 20, 3)

  expect(Browser.show2Below).toHaveBeenCalledWith(42, MenuEntryId.SimpleBrowserToolbar, 10, 20, 3)
  expect(Electron.show2Below).not.toHaveBeenCalled()
})

test('keeps unrelated native menus controlled by the title bar preference', async () => {
  platform.mockReturnValue(PlatformType.Electron)
  getPreference.mockImplementation((key) => (key === 'window.titleBarStyle' ? 'native' : false))

  await ContextMenu.show2(42, MenuEntryId.Editor, 10, 20)

  expect(Electron.show2).toHaveBeenCalledWith(42, MenuEntryId.Editor, 10, 20)
  expect(Browser.show2).not.toHaveBeenCalled()
})

test('does not use native menus outside Electron', async () => {
  platform.mockReturnValue(PlatformType.Remote)
  getPreference.mockReturnValue(true)

  await ContextMenu.show2(42, MenuEntryId.SimpleBrowserTab, 10, 20, 3)

  expect(Browser.show2).toHaveBeenCalledWith(42, MenuEntryId.SimpleBrowserTab, 10, 20, 3)
  expect(Electron.show2).not.toHaveBeenCalled()
})
