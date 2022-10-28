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

const ViewletTitleBarMenuBarToggleIndex = await import(
  '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarToggleIndex.js'
)

test('toggleIndex - when open - when same index', async () => {
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
    await ViewletTitleBarMenuBarToggleIndex.toggleIndex(state, 0)
  ).toMatchObject({
    focusedIndex: 0,
    isMenuOpen: false,
  })
})

test('toggleIndex - when open - when different index', async () => {
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
    await ViewletTitleBarMenuBarToggleIndex.toggleIndex(state, 1)
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

test('toggleIndex - when closed - when same index', async () => {
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
    await ViewletTitleBarMenuBarToggleIndex.toggleIndex(state, 0)
  ).toMatchObject({
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
  })
})

test('toggleIndex - when closed - when different index', async () => {
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
    await ViewletTitleBarMenuBarToggleIndex.toggleIndex(state, 1)
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
