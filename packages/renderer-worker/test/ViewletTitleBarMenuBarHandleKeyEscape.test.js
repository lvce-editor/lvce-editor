import { expect, test } from '@jest/globals'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'
import * as ViewletTitleBarMenuBarHandleKeyEscape from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleKeyEscape.js'

test('handleKeyEscape - close sub menu', () => {
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
            label: 'New File',
            flags: MenuItemFlags.None,
          },
          {
            label: 'Open Recent',
            flags: MenuItemFlags.SubMenu,
            id: MenuEntryId.OpenRecent,
          },
        ],
      },
      {
        level: 1,
        focusedIndex: -1,
        items: [
          {
            label: 'file-1.txt',
          },
          {
            label: 'file-2.txt',
          },
        ],
        x: 150,
        y: 25,
      },
    ],
  }
  expect(ViewletTitleBarMenuBarHandleKeyEscape.handleKeyEscape(state)).toMatchObject({
    menus: [
      {
        level: 0,
        focusedIndex: 1,
        items: [
          {
            label: 'New File',
            flags: MenuItemFlags.None,
          },
          {
            label: 'Open Recent',
            flags: MenuItemFlags.SubMenu,
            id: MenuEntryId.OpenRecent,
          },
        ],
      },
    ],
  })
})
