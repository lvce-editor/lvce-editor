/**
 * @jest-environment jsdom
 */

import * as Menu from '../src/parts/OldMenu/Menu.js'
import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

const getTextContent = (node) => {
  return node.innerHTML
}

const getSimpleList = ($ViewletTitleBarMenuBar) => {
  return Array.from($ViewletTitleBarMenuBar.children).map(getTextContent)
}

test('create', async () => {
  const state = ViewletTitleBarMenuBar.create()
  expect(state).toBeDefined()
})

test('setEntries', () => {
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setEntries(state, [
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
  ])
  const { $TitleBarMenuBar } = state
  expect(getSimpleList($TitleBarMenuBar)).toEqual(['File', 'Edit', 'Selection'])
})

// TODO test pageup/pagedown

// TODO test mouse enter (with index)

test('accessibility - ViewletTitleBarMenuBar should have role menubar', () => {
  const state = ViewletTitleBarMenuBar.create()
  const { $TitleBarMenuBar } = state
  // @ts-ignore
  expect($TitleBarMenuBar.role).toBe('menubar')
})

test('accessibility - TitleBarTopLevelEntry should have role menuitem and aria-haspopup and aria-expanded', () => {
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setEntries(state, [
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
  ])
  const { $TitleBarMenuBar } = state
  // @ts-ignore
  expect($TitleBarMenuBar.firstChild.role).toBe('menuitem')
  // @ts-ignore
  expect($TitleBarMenuBar.firstChild.ariaExpanded).toBe('false')
  // @ts-ignore
  expect($TitleBarMenuBar.firstChild.ariaHasPopup).toBe('true')
})

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
  $ViewletTitleBarMenuBar.firstChild.focus()
  ViewletTitleBarMenuBar.openMenu(-1, 1, 0, menuItems, false)
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
  $ViewletTitleBarMenuBar.firstChild.focus()
  ViewletTitleBarMenuBar.openMenu(1, 0, menuItems, true)
  expect(document.activeElement).toBe(Menu.state.$$Menus[0].firstChild)
})

test('setMenus - add one menu', () => {
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setMenus(state, [
    [
      'addMenu',
      {
        top: 0,
        left: 0,
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
  ])
  const { $$Menus } = state
  expect($$Menus.length).toBe(1)
  expect($$Menus[0].outerHTML).toBe(
    '<div class="Menu" tabindex="-1" style="width: 150px; height: 150px; top: 0px; left: 0px;" id="Menu-0"><div class="MenuItem" tabindex="-1" disabled="true">New File</div><div class="MenuItem" tabindex="-1" disabled="true">New Window</div><div class="MenuItem" tabindex="-1">Open Recent</div></div>'
  )
})

test('setMenus - open sub menu', () => {
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setMenus(state, [
    [
      'addMenu',
      {
        top: 0,
        left: 0,
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
  ])
  ViewletTitleBarMenuBar.setMenus(state, [
    [
      'updateMenu',
      {
        top: 0,
        left: 0,
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
        top: 0,
        left: 150,
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
  ])
  const { $$Menus } = state
  expect($$Menus.length).toBe(2)
  expect($$Menus[0].outerHTML).toBe(
    '<div class="Menu" tabindex="-1" style="width: 150px; height: 150px; top: 0px; left: 0px;" id="Menu-0"><div class="MenuItem" tabindex="-1" disabled="true">New File</div><div class="MenuItem" tabindex="-1" disabled="true">New Window</div><div class="MenuItem Focused" tabindex="-1">Open Recent</div></div>'
  )
  expect($$Menus[1].outerHTML).toBe(
    '<div class="Menu" tabindex="-1" style="width: 150px; height: 150px; top: 0px; left: 150px;" id="Menu-1"><div class="MenuItem" tabindex="-1">file-1.txt</div><div class="MenuItem" tabindex="-1">file-2.txt</div></div>'
  )
})
