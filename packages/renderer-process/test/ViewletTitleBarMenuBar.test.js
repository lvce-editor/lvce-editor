/**
 * @jest-environment jsdom
 */

import * as Menu from '../src/parts/OldMenu/Menu.js'
import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'

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
      flags: /* None */ 0,
    },
    {
      id: 'redo',
      name: 'Redo',
      flags: /* None */ 0,
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
      flags: /* None */ 0,
    },
    {
      id: 'redo',
      name: 'Redo',
      flags: /* None */ 0,
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
