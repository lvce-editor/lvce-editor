/**
 * @jest-environment jsdom
 */

import { expect, test } from '@jest/globals'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.ts'
import * as Menu from '../src/parts/OldMenu/Menu.ts'
import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.ts'

test('create', async () => {
  const state = ViewletTitleBarMenuBar.create()
  expect(state).toBeDefined()
})

// TODO test pageup/pagedown

// TODO test mouse enter (with index)

// TODO test focusIndex in combination with menu and also check aria-attributes

test.skip('openMenu - focus on menuBar', () => {
  const titleBarMenuEntries = [
    {
      id: 'file',
      name: 'File',
      children: [],
    },
    {
      id: 'edit',
      name: 'Edit',
      children: [],
    },
    {
      id: 'selection',
      name: 'Selection',
      children: [],
    },
  ]
  const menuItems = [
    {
      id: 'undo',
      name: 'Undo',
      flags: MenuItemFlags.None,
    },
    {
      id: 'redo',
      name: 'Redo',
      flags: MenuItemFlags.None,
    },
  ]
  const $ViewletTitleBarMenuBar =
    // @ts-ignore
    ViewletTitleBarMenuBar.create(titleBarMenuEntries)
  // @ts-ignore
  document.body.append($ViewletTitleBarMenuBar)
  // @ts-ignore
  $ViewletTitleBarMenuBar.firstChild.focus()
  // @ts-ignore
  ViewletTitleBarMenuBar.openMenu(-1, 1, 0, menuItems, false)
  // @ts-ignore
  expect(document.activeElement).toBe($ViewletTitleBarMenuBar.children[1])
})

test.skip('openMenu - focus on menu', () => {
  const titleBarMenuEntries = [
    {
      id: 'file',
      name: 'File',
      children: [],
    },
    {
      id: 'edit',
      name: 'Edit',
      children: [],
    },
    {
      id: 'selection',
      name: 'Selection',
      children: [],
    },
  ]
  const menuItems = [
    {
      id: 'undo',
      name: 'Undo',
      flags: MenuItemFlags.None,
    },
    {
      id: 'redo',
      name: 'Redo',
      flags: MenuItemFlags.None,
    },
  ]
  const $ViewletTitleBarMenuBar =
    // @ts-ignore

    ViewletTitleBarMenuBar.create(titleBarMenuEntries)
  // @ts-ignore
  document.body.append($ViewletTitleBarMenuBar)
  // @ts-ignore
  $ViewletTitleBarMenuBar.firstChild.focus()
  // @ts-ignore
  ViewletTitleBarMenuBar.openMenu(1, 0, menuItems, true)
  // @ts-ignore
  expect(document.activeElement).toBe(Menu.state.$$Menus[0].firstChild)
})

test.skip('setMenus - add one menu', () => {
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setMenus(
    state,
    [
      [
        'addMenu',
        {
          x: 0,
          y: 0,
          width: 150,
          height: 150,
          focusedIndex: -1,
          level: 0,
          items: [
            {
              flags: MenuItemFlags.Disabled,
              label: 'New File',
            },
            {
              flags: MenuItemFlags.Disabled,
              label: 'New Window',
            },
            {
              flags: MenuItemFlags.SubMenu,
              label: 'Open Recent',
            },
          ],
        },
      ],
    ],
    1,
  )
  const { $$Menus } = state
  expect($$Menus.length).toBe(1)
  // @ts-ignore
  expect($$Menus[0].outerHTML).toBe(
    '<div class="Menu" tabindex="-1" style="top: 0px; left: 0px; width: 150px; height: 150px;" id="Menu-0"><div class="MenuItem" tabindex="-1" disabled="true">New File</div><div class="MenuItem" tabindex="-1" disabled="true">New Window</div><div class="MenuItem" tabindex="-1">Open Recent</div></div>',
  )
})

test.skip('setMenus - open sub menu', () => {
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setMenus(
    state,
    [
      [
        'addMenu',
        {
          x: 0,
          y: 0,
          width: 150,
          height: 150,
          focusedIndex: -1,
          level: 0,
          items: [
            {
              flags: MenuItemFlags.Disabled,
              label: 'New File',
            },
            {
              flags: MenuItemFlags.Disabled,
              label: 'New Window',
            },
            {
              flags: MenuItemFlags.SubMenu,
              label: 'Open Recent',
            },
          ],
        },
      ],
    ],
    1,
  )
  ViewletTitleBarMenuBar.setMenus(
    state,
    [
      [
        'updateMenu',
        {
          x: 0,
          y: 0,
          width: 150,
          height: 150,
          focusedIndex: 2,
          level: 0,
          items: [
            {
              flags: MenuItemFlags.Disabled,
              label: 'New File',
            },
            {
              flags: MenuItemFlags.Disabled,
              label: 'New Window',
            },
            {
              flags: MenuItemFlags.SubMenu,
              label: 'Open Recent',
            },
          ],
        },
      ],
      [
        'addMenu',
        {
          x: 150,
          y: 0,
          width: 150,
          height: 150,
          focusedIndex: -1,
          level: 1,
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
    ],
    1,
  )
  const { $$Menus } = state
  expect($$Menus.length).toBe(2)
  // @ts-ignore
  expect($$Menus[0].outerHTML).toBe(
    '<div class="Menu" tabindex="-1" style="top: 0px; left: 0px; width: 150px; height: 150px;" id="Menu-0"><div class="MenuItem" tabindex="-1" disabled="true">New File</div><div class="MenuItem" tabindex="-1" disabled="true">New Window</div><div class="MenuItem MenuItemFocused" tabindex="-1">Open Recent</div></div>',
  )
  // @ts-ignore
  expect($$Menus[1].outerHTML).toBe(
    '<div class="Menu" tabindex="-1" style="top: 0px; left: 150px; width: 150px; height: 150px;" id="Menu-1"><div class="MenuItem" tabindex="-1">file-1.txt</div><div class="MenuItem" tabindex="-1">file-2.txt</div></div>',
  )
})
