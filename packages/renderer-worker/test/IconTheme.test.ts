// @ts-nocheck
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/HandleIconThemeChange/HandleIconThemeChange.js', () => ({
  handleIconThemeChange: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/GetIconThemeEtag/GetIconThemeEtag.js', () => ({
  getIconThemeEtag: jest.fn(() => ''),
}))

jest.unstable_mockModule('../src/parts/IconThemeWorker/IconThemeWorker.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  get: jest.fn(),
}))

const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')
const GetIconThemeEtag = await import('../src/parts/GetIconThemeEtag/GetIconThemeEtag.js')
const GlobalEventBus = await import('../src/parts/GlobalEventBus/GlobalEventBus.js')
const HandleIconThemeChange = await import('../src/parts/HandleIconThemeChange/HandleIconThemeChange.js')
const IconTheme = await import('../src/parts/IconTheme/IconTheme.js')
const IconThemeWorker = await import('../src/parts/IconThemeWorker/IconThemeWorker.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')

beforeEach(() => {
  jest.resetAllMocks()
  GlobalEventBus.state.listenerMap = Object.create(null)
  ExtensionManagementWorker.invoke.mockResolvedValue([])
  GetIconThemeEtag.getIconThemeEtag.mockReturnValue('')
})

test('setIconTheme uses remote icon paths in the Electron development server', async () => {
  await IconTheme.setIconTheme('vscode-icons', PlatformType.Electron, '')

  expect(IconThemeWorker.invoke).toHaveBeenCalledWith('IconTheme.getIconThemeJson', [], 'vscode-icons', '', PlatformType.Remote, true, '')
})

test('setIconTheme keeps optimized icon paths in a packaged Electron app', async () => {
  await IconTheme.setIconTheme('vscode-icons', PlatformType.Electron, '/static/commit')

  expect(IconThemeWorker.invoke).toHaveBeenCalledWith(
    'IconTheme.getIconThemeJson',
    [],
    'vscode-icons',
    '/static/commit',
    PlatformType.Electron,
    true,
    '',
  )
})

test('setIconTheme passes the production icon theme content etag to the worker', async () => {
  GetIconThemeEtag.getIconThemeEtag.mockReturnValue('content-hash')

  await IconTheme.setIconTheme('vscode-icons', PlatformType.Web, '/static/commit')

  expect(IconThemeWorker.invoke).toHaveBeenCalledWith(
    'IconTheme.getIconThemeJson',
    [],
    'vscode-icons',
    '/static/commit',
    PlatformType.Web,
    true,
    'content-hash',
  )
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
  expect(IconThemeWorker.invoke).toHaveBeenCalledWith('IconTheme.getIconThemeJson', [], 'custom-icons', '/static', PlatformType.Remote, true, '')
})

test('hydrate uses the default icon theme when the setting is absent', async () => {
  Preferences.get.mockReturnValue(undefined)

  await IconTheme.hydrate(PlatformType.Remote, '/static')

  expect(IconThemeWorker.invoke).toHaveBeenCalledWith('IconTheme.getIconThemeJson', [], 'vscode-icons', '/static', PlatformType.Remote, true, '')
})

test('hydrate disables file icons when the workbench icon theme is null', async () => {
  Preferences.get.mockImplementation((key) => (key === 'workbench.iconTheme' ? null : undefined))

  await IconTheme.hydrate(PlatformType.Remote, '/static')

  expect(ExtensionManagementWorker.invoke).not.toHaveBeenCalled()
  expect(IconThemeWorker.invoke).toHaveBeenCalledWith('IconTheme.getIconThemeJson', [], null, '/static', PlatformType.Remote, true, '')
  expect(HandleIconThemeChange.handleIconThemeChange).toHaveBeenCalledTimes(1)
})

test('updates the icon theme when the workbench icon theme setting changes', async () => {
  let iconThemeId = 'custom-icons'
  Preferences.get.mockImplementation((key) => (key === 'workbench.iconTheme' ? iconThemeId : undefined))
  await IconTheme.hydrate(PlatformType.Remote, '/static')
  jest.clearAllMocks()

  iconThemeId = null
  await GlobalEventBus.emitEvent('preferences.changed')

  expect(ExtensionManagementWorker.invoke).not.toHaveBeenCalled()
  expect(IconThemeWorker.invoke).toHaveBeenCalledWith('IconTheme.getIconThemeJson', [], null, '/static', PlatformType.Remote, true, '')
  expect(HandleIconThemeChange.handleIconThemeChange).toHaveBeenCalledTimes(1)
})
