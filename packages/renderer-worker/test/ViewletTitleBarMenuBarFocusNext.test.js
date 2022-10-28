import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'
import * as ViewletTitleBarMenuBarFocusNext from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarFocusNext.js'

test('focusNext', () => {
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
  }
  expect(ViewletTitleBarMenuBarFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusNext - with disabled items', () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    titleBarEntries: [
      {
        id: MenuEntryId.File,
        name: 'File',
        flags: MenuItemFlags.None,
      },
      {
        id: MenuEntryId.Edit,
        name: 'Edit',
        flags: MenuItemFlags.None,
      },
      {
        id: MenuEntryId.Selection,
        name: 'Selection',
        flags: MenuItemFlags.None,
      },
    ],
  }
  expect(ViewletTitleBarMenuBarFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusNext - at end', () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 2,
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
  }
  expect(ViewletTitleBarMenuBarFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 0,
  })
})
