import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'
import * as ViewletTitleBarMenuBarHandleKeyArrowUp from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleKeyArrowUp.js'

test('handleKeyArrowUp - with menu open', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    titleBarEntries: [
      {
        id: MenuEntryId.File,
        name: 'File',
      },
      {
        id: MenuEntryId.Edit,
        name: 'Edit',
      },
      {
        id: MenuEntryId.Selection,
        name: 'Selection',
      },
    ],
    isMenuOpen: true,
    menus: [
      {
        level: 0,
        focusedIndex: 1,
        items: [
          {
            label: '1',
          },
          {
            label: '2',
          },
        ],
      },
    ],
  }
  expect(
    await ViewletTitleBarMenuBarHandleKeyArrowUp.handleKeyArrowUp(state)
  ).toMatchObject({
    menus: [
      {
        level: 0,
        focusedIndex: 0,
        items: [
          {
            label: '1',
          },
          {
            label: '2',
          },
        ],
      },
    ],
  })
})
