/**
 * @jest-environment jsdom
 */

import * as Menu from '../src/parts/OldMenu/Menu.js'
import * as TitleBarMenuBar from '../src/parts/TitleBarMenuBar/TitleBarMenuBar.js'

const getTextContent = (node) => {
  return node.innerHTML
}

const getSimpleList = ($TitleBarMenuBar) => {
  return Array.from($TitleBarMenuBar.children).map(getTextContent)
}

test.skip('create', async () => {
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
  const $TitleBarMenuBar = TitleBarMenuBar.create(titleBarMenuEntries)
  expect(getSimpleList($TitleBarMenuBar)).toEqual(['File', 'Edit', 'Selection'])
})

// TODO test pageup/pagedown

// TODO test mouse enter (with index)

test.skip('accessibility - TitleBarMenuBar should have role menubar', () => {
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
  const $TitleBarMenuBar = TitleBarMenuBar.create(titleBarMenuEntries)
  expect($TitleBarMenuBar.getAttribute('role')).toBe('menubar')
})

test.skip('accessibility - TitleBarTopLevelEntry should have role menuitem and aria-haspopup and aria-expanded', () => {
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
  const $TitleBarMenuBar = TitleBarMenuBar.create(titleBarMenuEntries)
  expect($TitleBarMenuBar.firstChild.getAttribute('role')).toBe('menuitem')
  expect($TitleBarMenuBar.firstChild.ariaExpanded).toBe('false')
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
  const $TitleBarMenuBar = TitleBarMenuBar.create(titleBarMenuEntries)
  document.body.append($TitleBarMenuBar)
  $TitleBarMenuBar.firstChild.focus()
  TitleBarMenuBar.openMenu(-1, 1, 0, menuItems, false)
  expect(document.activeElement).toBe($TitleBarMenuBar.children[1])
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
  const $TitleBarMenuBar = TitleBarMenuBar.create(titleBarMenuEntries)
  document.body.append($TitleBarMenuBar)
  $TitleBarMenuBar.firstChild.focus()
  TitleBarMenuBar.openMenu(1, 0, menuItems, true)
  expect(document.activeElement).toBe(Menu.state.$$Menus[0].firstChild)
})
