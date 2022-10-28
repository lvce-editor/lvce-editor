import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'
import * as ViewletTitleBarMenuBarFocusIndex from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarFocusIndex.js'

test('focusIndex - when open - when same index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: true,
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
  }
  expect(
    await ViewletTitleBarMenuBarFocusIndex.focusIndex(state, 0)
  ).toMatchObject({
    focusedIndex: 0,
    menus: [
      {
        level: 0,
        items: [
          {
            flags: MenuItemFlags.Disabled,
            id: 'newFile',
            label: 'New File',
          },
          {
            flags: MenuItemFlags.Disabled,
            id: 'newWindow',
            label: 'New Window',
          },
          {
            flags: MenuItemFlags.SubMenu,
            id: MenuEntryId.OpenRecent,
            label: 'Open Recent',
          },
        ],
      },
    ],
  })
})

test('focusIndex - when opening different index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: true,
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
  }
  expect(
    await ViewletTitleBarMenuBarFocusIndex.focusIndex(state, 1)
  ).toMatchObject({
    focusedIndex: 1,
    menus: [
      {
        level: 0,
        items: [
          {
            flags: MenuItemFlags.Disabled,
            id: 'undo',
            label: 'Undo',
          },
          {
            flags: MenuItemFlags.Disabled,
            id: 'redo',
            label: 'Redo',
          },
        ],
      },
    ],
  })
})

test('focusIndex - when open - race condition', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: true,
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
  }
  expect(
    await ViewletTitleBarMenuBarFocusIndex.focusIndex(state, 1)
  ).toMatchObject({
    focusedIndex: 1,
    menus: [
      {
        level: 0,
        items: [
          {
            flags: MenuItemFlags.Disabled,
            id: 'undo',
            label: 'Undo',
          },
          {
            flags: MenuItemFlags.Disabled,
            id: 'redo',
            label: 'Redo',
          },
        ],
      },
    ],
  })
})

test('focusIndex - when closed - when same index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: false,
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
  }
  expect(
    await ViewletTitleBarMenuBarFocusIndex.focusIndex(state, 0)
  ).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusIndex - when closed - when different index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: false,
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
  }
  expect(
    await ViewletTitleBarMenuBarFocusIndex.focusIndex(state, 1)
  ).toMatchObject({
    focusedIndex: 1,
  })
})
