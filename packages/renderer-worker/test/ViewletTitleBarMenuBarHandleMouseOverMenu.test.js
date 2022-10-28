import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'

import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: () => {
        return {
          left: 0,
          bottom: 0,
        }
      },
    }
  }
)

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

const ViewletTitleBarMenuBarHandleMenuMouseOver = await import(
  '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleMenuMouseOver.js'
)

test('handleMouseOverMenu - focus item', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: true,
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
  }
  expect(
    await ViewletTitleBarMenuBarHandleMenuMouseOver.handleMenuMouseOver(
      state,
      0,
      1
    )
  ).toMatchObject({
    menus: [
      {
        level: 0,
        focusedIndex: 1,
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

test('handleMouseOverMenu - focus item - already focused', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: true,
    menus: [
      {
        level: 0,
        focusedIndex: 1,
        top: 0,
        left: 0,
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
  }
  expect(
    await ViewletTitleBarMenuBarHandleMenuMouseOver.handleMenuMouseOver(
      state,
      0,
      1
    )
  ).toBe(state)
})

test('handleMouseOverMenu - open sub menu', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: true,
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
  }
  expect(
    await ViewletTitleBarMenuBarHandleMenuMouseOver.handleMenuMouseOver(
      state,
      0,
      2
    )
  ).toMatchObject({
    menus: [
      {
        level: 0,
        focusedIndex: 2,
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
      {
        level: 1,
        focusedIndex: -1,
        items: [
          {
            flags: MenuItemFlags.None,
            label: 'file-1.txt',
          },
          {
            flags: MenuItemFlags.None,
            label: 'file-2.txt',
          },
        ],
      },
    ],
  })
})

test('handleMouseOverMenu - unfocus sub menu', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: true,
    menus: [
      {
        level: 0,
        focusedIndex: 2,
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
      {
        level: 1,
        focusedIndex: 1,
        items: [
          {
            flags: MenuItemFlags.None,
            label: 'file-1.txt',
          },
          {
            flags: MenuItemFlags.None,
            label: 'file-2.txt',
          },
        ],
      },
    ],
  }
  expect(
    await ViewletTitleBarMenuBarHandleMenuMouseOver.handleMenuMouseOver(
      state,
      0,
      2
    )
  ).toMatchObject({
    menus: [
      {
        level: 0,
        focusedIndex: 2,
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
      {
        level: 1,
        focusedIndex: -1,
        items: [
          {
            flags: MenuItemFlags.None,
            label: 'file-1.txt',
          },
          {
            flags: MenuItemFlags.None,
            label: 'file-2.txt',
          },
        ],
      },
    ],
  })
})

test('handleMouseOverMenu - unfocus menu and sub menu', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: true,
    menus: [
      {
        level: 0,
        focusedIndex: 2,
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
      {
        level: 1,
        focusedIndex: 1,
        items: [
          {
            flags: MenuItemFlags.None,
            label: 'file-1.txt',
          },
          {
            flags: MenuItemFlags.None,
            label: 'file-2.txt',
          },
        ],
      },
    ],
  }
  expect(
    await ViewletTitleBarMenuBarHandleMenuMouseOver.handleMenuMouseOver(
      state,
      0,
      -1
    )
  ).toMatchObject({
    menus: [
      {
        level: 0,
        focusedIndex: -1,
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
