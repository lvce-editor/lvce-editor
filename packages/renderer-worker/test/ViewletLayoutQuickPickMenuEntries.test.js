import { beforeEach, expect, jest, test } from '@jest/globals'
import * as AutoUpdateType from '../src/parts/AutoUpdateType/AutoUpdateType.js'

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

const mockGetAutoUpdateType = jest.fn(() => AutoUpdateType.None)

beforeEach(() => {
  jest.clearAllMocks()
  mockGetAutoUpdateType.mockImplementation(() => AutoUpdateType.None)
})

jest.unstable_mockModule('../src/parts/MenuEntriesState/MenuEntriesState.js', () => {
  return {
    getAll: jest.fn(() => menuEntries),
  }
})

jest.unstable_mockModule('../src/parts/GetAutoUpdateType/GetAutoUpdateType.js', () => {
  return {
    getAutoUpdateType: mockGetAutoUpdateType,
  }
})

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
