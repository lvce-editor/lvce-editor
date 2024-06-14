import { beforeEach, expect, jest, test } from '@jest/globals'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: () => {
      return {
        x: 0,
        bottom: 0,
      }
    },
  }
})

jest.unstable_mockModule('../src/parts/MenuEntries/MenuEntries.js', () => {
  return {
    getMenuEntries: (id) => {
      switch (id) {
        case MenuEntryId.File:
          return [
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
          ]
        case MenuEntryId.Edit:
          return [
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
          ]
        case MenuEntryId.Selection:
          return []
        case MenuEntryId.OpenRecent:
          return [
            {
              flags: MenuItemFlags.None,
              label: 'file-1.txt',
            },
            {
              flags: MenuItemFlags.None,
              label: 'file-2.txt',
            },
          ]
        default:
          throw new Error(`no menu entries found for ${id}`)
      }
    },
  }
})

const ViewletTitleBarMenuBarOpenMenu = await import('../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarOpenMenu.js')

test('openMenu - when no focusedIndex', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: -1,
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
  expect(await ViewletTitleBarMenuBarOpenMenu.openMenu(state, /* focus */ false)).toMatchObject({
    isMenuOpen: false,
  })
})

test('openMenu - when focusedIndex', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    titleBarEntries: [
      {
        id: MenuEntryId.File,
        name: 'File',
        width: 40,
      },
      {
        id: MenuEntryId.Edit,
        name: 'Edit',
        width: 40,
      },
    ],
    titleBarHeight: 20,
    x: 0,
  }
  expect(await ViewletTitleBarMenuBarOpenMenu.openMenu(state, /* focus */ true)).toMatchObject({
    menus: [
      {
        level: 0,
        x: 0,
        y: 20,
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
