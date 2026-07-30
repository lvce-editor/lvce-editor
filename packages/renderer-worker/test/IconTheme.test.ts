// @ts-nocheck
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/HandleIconThemeChange/HandleIconThemeChange.js', () => ({
  handleIconThemeChange: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/IconThemeWorker/IconThemeWorker.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  get: jest.fn(),
}))

const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')
const IconTheme = await import('../src/parts/IconTheme/IconTheme.js')
const IconThemeWorker = await import('../src/parts/IconThemeWorker/IconThemeWorker.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')

beforeEach(() => {
  jest.resetAllMocks()
  ExtensionManagementWorker.invoke.mockResolvedValue([])
})

test('setIconTheme uses remote icon paths in the Electron development server', async () => {
  await IconTheme.setIconTheme('vscode-icons', PlatformType.Electron, '')

  expect(IconThemeWorker.invoke).toHaveBeenCalledWith('IconTheme.getIconThemeJson', [], 'vscode-icons', '', PlatformType.Remote, true)
})

test('setIconTheme keeps optimized icon paths in a packaged Electron app', async () => {
  await IconTheme.setIconTheme('vscode-icons', PlatformType.Electron, '/static/commit')

  expect(IconThemeWorker.invoke).toHaveBeenCalledWith('IconTheme.getIconThemeJson', [], 'vscode-icons', '/static/commit', PlatformType.Electron, true)
})

test('hydrate uses the configured workbench icon theme', async () => {
  Preferences.get.mockImplementation((key) => {
    if (key === 'workbench.iconTheme') {
      return 'custom-icons'
    }
    return undefined
  })

  await IconTheme.hydrate(PlatformType.Remote, '/static')

  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith('Extensions.getAllExtensions', '/static', PlatformType.Remote)
  expect(IconThemeWorker.invoke).toHaveBeenCalledWith('IconTheme.getIconThemeJson', [], 'custom-icons', '/static', PlatformType.Remote, true)
})
