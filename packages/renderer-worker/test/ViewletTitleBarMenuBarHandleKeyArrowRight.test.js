import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
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

const ViewletTitleBarMenuBarHandleKeyArrowRight = await import('../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleKeyArrowRight.js')

test('handleKeyArrowRight - open sub menu', async () => {
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
        x: 0,
        y: 0,
      },
    ],
  }
  expect(await ViewletTitleBarMenuBarHandleKeyArrowRight.handleKeyArrowRight(state)).toMatchObject({
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
        focusedIndex: 0,
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
  })
})
