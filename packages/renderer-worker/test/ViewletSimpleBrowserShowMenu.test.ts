import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ContextMenu/ContextMenu.js', () => ({
  show2Below: jest.fn(),
}))

const ContextMenu = await import('../src/parts/ContextMenu/ContextMenu.js')
const MenuEntryId = await import('../src/parts/MenuEntryId/MenuEntryId.js')
const ViewletSimpleBrowserShowMenu = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserShowMenu.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('opens the toolbar menu below the menu button in its nested toolbar', async () => {
  const state = { uid: 42, y: 95 }

  await expect(ViewletSimpleBrowserShowMenu.showMenu(state, 700, 35, 0, 30)).resolves.toBe(state)
  expect(ContextMenu.show2Below).toHaveBeenCalledWith(42, MenuEntryId.SimpleBrowserToolbar, 700, 160)
})
