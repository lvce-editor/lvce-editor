import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'
import * as ViewletTitleBarMenuBarCloseMenu from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarCloseMenu.js'

test("closeMenu - don't keep focus", () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    titleBarEntries: [
      {
        id: MenuEntryId.File,
        name: 'File',
      },
      {
        id: MenuEntryId.Edit,
        name: 'Edit',
      },
    ],
    focusedIndex: 0,
  }
  expect(
    ViewletTitleBarMenuBarCloseMenu.closeMenu(state, /* keepFocus */ false)
  ).toMatchObject({
    isMenuOpen: false,
  })
})

test('closeMenu - keep focus', () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    titleBarEntries: [
      {
        id: MenuEntryId.File,
        name: 'File',
      },
      {
        id: MenuEntryId.Edit,
        name: 'Edit',
      },
    ],
    focusedIndex: 0,
  }
  expect(
    ViewletTitleBarMenuBarCloseMenu.closeMenu(state, /* keepFocus */ true)
  ).toMatchObject({
    isMenuOpen: false,
    focusedIndex: 0,
  })
})
