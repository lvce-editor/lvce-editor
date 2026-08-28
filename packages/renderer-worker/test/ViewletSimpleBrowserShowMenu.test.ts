import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ContextMenu/ContextMenu.js', () => ({
  show2: jest.fn(),
}))

const ContextMenu = await import('../src/parts/ContextMenu/ContextMenu.js')
const MenuEntryId = await import('../src/parts/MenuEntryId/MenuEntryId.js')
const ViewletSimpleBrowserShowMenu = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserShowMenu.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('opens the toolbar menu at the menu button', async () => {
  const state = { uid: 42 }

  await expect(ViewletSimpleBrowserShowMenu.showMenu(state, 700, 65)).resolves.toBe(state)
  expect(ContextMenu.show2).toHaveBeenCalledWith(42, MenuEntryId.SimpleBrowserToolbar, 700, 65)
})
