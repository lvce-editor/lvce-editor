import { beforeEach, expect, jest, test } from '@jest/globals'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ContextMenu/ContextMenu.js', () => ({
  show2: jest.fn(),
}))

const ContextMenu = await import('../src/parts/ContextMenu/ContextMenu.js')
const ViewletSimpleBrowserHandleTabContextMenu = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserHandleTabContextMenu.js')

test('opens the tab context menu for the originating viewlet and tab', async () => {
  const state = {
    tabs: [{ browserViewId: 12 }, { browserViewId: 13 }],
    uid: 42,
  }

  const newState = await ViewletSimpleBrowserHandleTabContextMenu.handleTabContextMenu(state, '1', 100, 200)

  expect(newState).toBe(state)
  expect(ContextMenu.show2).toHaveBeenCalledWith(42, MenuEntryId.SimpleBrowserTab, 100, 200, 1)
})

test('ignores a stale tab index', async () => {
  const state = {
    tabs: [{ browserViewId: 12 }],
    uid: 42,
  }

  const newState = await ViewletSimpleBrowserHandleTabContextMenu.handleTabContextMenu(state, '2', 100, 200)

  expect(newState).toBe(state)
  expect(ContextMenu.show2).not.toHaveBeenCalled()
})
