import { beforeEach, expect, jest, test } from '@jest/globals'
import * as AutoUpdateType from '../src/parts/AutoUpdateType/AutoUpdateType.js'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

const menuEntries = [
  {
    id: 'AutoUpdater.checkForUpdates',
    label: 'Updater: Check for Updates',
  },
  {
    id: 'Layout.toggleSideBar',
    label: 'Layout: Toggle Side Bar',
  },
]

const mockGetAutoUpdateType = jest.fn<(method: string) => string>(() => AutoUpdateType.None)
const mockGetPlatform = jest.fn(() => PlatformType.Electron)

beforeEach(() => {
  jest.clearAllMocks()
  mockGetAutoUpdateType.mockImplementation(() => AutoUpdateType.None)
  mockGetPlatform.mockImplementation(() => PlatformType.Electron)
})

jest.unstable_mockModule('../src/parts/MenuEntriesState/MenuEntriesState.js', () => {
  return {
    getAll: jest.fn(() => menuEntries),
  }
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: mockGetAutoUpdateType,
  }
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: mockGetPlatform,
  platform: PlatformType.Test,
}))

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')

test('getAllQuickPickMenuEntries - deb', async () => {
  mockGetAutoUpdateType.mockImplementation(() => AutoUpdateType.Deb)

  expect(await ViewletLayout.getAllQuickPickMenuEntries()).toEqual([
    {
      id: 'Layout.toggleSideBar',
      label: 'Layout: Toggle Side Bar',
    },
  ])
})

test('getAllQuickPickMenuEntries - not deb', async () => {
  mockGetAutoUpdateType.mockImplementation(() => AutoUpdateType.AppImage)

  expect(await ViewletLayout.getAllQuickPickMenuEntries()).toEqual(menuEntries)
})

test('getAllQuickPickMenuEntries - web without a shared process', async () => {
  mockGetPlatform.mockReturnValue(PlatformType.Web)
  mockGetAutoUpdateType.mockImplementation(() => {
    throw new Error('shared process is unavailable')
  })

  expect(await ViewletLayout.getAllQuickPickMenuEntries()).toEqual(menuEntries)
  expect(mockGetAutoUpdateType).not.toHaveBeenCalled()
})

test('getAllQuickPickMenuEntries - remote deb', async () => {
  mockGetPlatform.mockReturnValue(PlatformType.Remote)
  mockGetAutoUpdateType.mockReturnValue(AutoUpdateType.Deb)

  expect(await ViewletLayout.getAllQuickPickMenuEntries()).toEqual([menuEntries[1]])
  expect(mockGetAutoUpdateType).toHaveBeenCalledWith('AutoUpdater.getAutoUpdateType')
})

test('getAllQuickPickMenuEntries validates a cached hash without returning commands', async () => {
  const response = await ViewletLayout.getAllQuickPickMenuEntries(null)
  expect(response).toMatchObject({ commands: menuEntries, matchesCache: false })
  if (!response || typeof response !== 'object' || !('hash' in response)) {
    throw new Error('expected a command cache response')
  }
  expect(await ViewletLayout.getAllQuickPickMenuEntries(response.hash)).toEqual({ hash: response.hash, matchesCache: true })
  expect(await ViewletLayout.getAllQuickPickMenuEntries('f'.repeat(64))).toMatchObject({ commands: menuEntries, matchesCache: false })
})
