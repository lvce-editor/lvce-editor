/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as Menu from '../src/parts/OldMenu/Menu.js'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.js'

beforeEach(() => {
  Menu.state.$$Menus = []
})

const getTextContent = ($Node) => {
  return $Node.textContent
}
const getSimpleList = ($Menu) => {
  return Array.from($Menu.children).map(getTextContent)
}

test('showControlled', () => {
  Menu.showControlled({
    x: 0,
    y: 0,
    items: [
      {
        id: 'item-1', // TODO probably don't need id -> just use index
        label: 'item 1',
        flags: 0,
      },
      {
        label: '__Separator',
        flags: 1,
      },
      {
        id: 'item-2',
        label: 'item 2',
        flags: 2,
      },
      {
        id: 'item-3',
        label: 'item 3',
        flags: 3,
      },
    ],
    handleKeyDown() {},
    handleFocusOut() {},
    $Parent: document.body,
    level: 0,
    width: 100,
    height: 100,
  })
  expect(Menu.state.$$Menus).toHaveLength(1)
  expect(getSimpleList(Menu.state.$$Menus[0])).toEqual([
    'item 1',
    '',
    'item 2',
    'item 3',
  ])
})

test.skip('focus', () => {
  Menu.showControlled({
    x: 0,
    y: 0,
    items: [
      {
        id: 'item-1', // TODO probably don't need id -> just use index
        label: 'item 1',
        flags: 0,
      },
      {
        label: '__Separator',
        flags: 1,
      },
      {
        id: 'item-2',
        label: 'item 2',
        flags: 2,
      },
      {
        id: 'item-3',
        label: 'item 3',
        flags: 3,
      },
    ],
    handleKeyDown() {},
    handleFocusOut() {},
    $Parent: document.body,
    level: 0,
    width: 100,
    height: 100,
  })
  // @ts-ignore
  Menu.focus()
  expect(document.activeElement).toBe(Menu.state.$$Menus[0].firstChild)
})

test('accessibility - Menu show have role menu', () => {
  Menu.showControlled({
    x: 0,
    y: 0,
    items: [
      {
        id: 'item-1',
        label: 'item 1',
        flags: 0,
      },
      {
        label: '__Separator',
        flags: 1,
      },
      {
        id: 'item-2',
        label: 'item 2',
        flags: 2,
      },
      {
        id: 'item-3',
        label: 'item 3',
        flags: 3,
      },
    ],
    handleKeyDown() {},
    $Parent: undefined,
    handleFocusOut() {},
    level: 0,
    width: 100,
    height: 100,
  })
  expect(Menu.state.$$Menus[0].getAttribute('role')).toBe('menu')
})

test('accessibility - MenuItem show have role menuitem or separator', () => {
  Menu.showControlled({
    x: 0,
    y: 0,
    level: 0,
    $Parent: undefined,
    handleFocusOut() {},
    items: [
      {
        id: 'item-1',
        label: 'item 1',
        flags: 0,
      },
      {
        label: '__Separator',
        flags: 1,
      },
      {
        id: 'item-2',
        label: 'item 2',
        flags: 2,
      },
      {
        id: 'item-3',
        label: 'item 3',
        flags: 3,
      },
    ],
    handleKeyDown() {},
    height: 100,
    width: 100,
  })
  const $Menu = Menu.state.$$Menus[0]
  expect($Menu.firstChild.getAttribute('role')).toBe('menuitem')
  expect($Menu.children[1].getAttribute('role')).toBe('separator')
})

test('showMenu - error - item has missing flags', () => {
  console.warn = jest.fn()
  Menu.showMenu(0, 0, 100, 250, [
    {
      label: 'item 1',
    },
  ])
  expect(console.warn).toHaveBeenCalledTimes(1)
  expect(console.warn).toHaveBeenCalledWith('invalid menu item flags:', {
    label: 'item 1',
  })
})

test('showMenu - error - item has missing label', () => {
  console.warn = jest.fn()
  Menu.showMenu(0, 0, 100, 250, [
    {
      flags: 2,
      label: undefined,
    },
  ])
  expect(console.warn).toHaveBeenCalledTimes(1)
  expect(console.warn).toHaveBeenCalledWith('menu item has missing label', {
    flags: 2,
    label: undefined,
  })
  const $Menu = Menu.state.$$Menus[0]
  expect($Menu.children[0].textContent).toBe('n/a')
})

test('showMenu - with sub menu', () => {
  Menu.showMenu(
    0,
    0,
    100,
    100,
    [
      {
        id: 'newFile',
        label: 'New File',
        flags: /* Disabled */ 5,
      },
      {
        id: 'newWindow',
        label: 'New Window',
        flags: /* None */ 0,
      },
      {
        id: 'separator',
        label: 'Separator',
        flags: /* Separator */ 1,
      },
      {
        id: 'openFile',
        label: 'Open File',
        flags: /* Disabled */ 5,
      },
      {
        id: 'openFolder',
        label: 'Open Folder',
        flags: /* None */ 0,
      },
      {
        id: 'openRecent',
        label: 'Open Recent',
        flags: /* SubMenu */ 4,
      },
      {
        id: 'separator',
        label: 'Separator',
        flags: /* Separator */ 1,
      },
      {
        id: 'exit',
        label: 'Exit',
        flags: /* None */ 0,
      },
    ],
    0,
    -1
  )
  Menu.showMenu(
    100,
    100,
    200,
    200,
    [
      {
        id: 'separator',
        label: 'Separator',
        flags: /* Separator */ 1,
      },
      {
        id: 'more',
        label: 'More...',
        flags: /* None */ 0,
      },
      {
        id: 'separator',
        label: 'Separator',
        flags: /* Separator */ 1,
      },
      {
        id: 'clearRecentlyOpened',
        label: 'Clear Recently Opened',
        flags: /* None */ 0,
      },
    ],
    1,
    5
  )
  const $Menu = Menu.state.$$Menus[0]
  const $SubMenu = Menu.state.$$Menus[1]
  expect($Menu.children).toHaveLength(8)
  expect($SubMenu.children).toHaveLength(4)

  const $MenuItemOpenRecent = $Menu.children[5]
  expect($MenuItemOpenRecent.textContent).toBe('Open Recent')
  expect($MenuItemOpenRecent.ariaExpanded).toBe('true')
  expect($MenuItemOpenRecent.getAttribute('aria-owns')).toBe('Menu-1')
})

test('event - click', () => {
  Menu.showMenu(0, 0, 100, 250, [
    {
      label: 'item 1',
      flags: 0,
    },
  ])
  RendererWorker.state.send = jest.fn()
  const $Menu = Menu.state.$$Menus[0]
  $Menu.children[0].dispatchEvent(
    new Event('mousedown', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledWith([7403, 0, 0])
})

test('event - click - outside', () => {
  Menu.showMenu(0, 0, 100, 250, [
    {
      label: 'item 1',
      flags: 0,
    },
    {
      label: 'item 2',
      flags: 0,
    },
  ])
  RendererWorker.state.send = jest.fn()
  const $Menu = Menu.state.$$Menus[0]
  $Menu.dispatchEvent(
    new Event('mousedown', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.state.send).not.toHaveBeenCalled()
})

test('event - right click outside', () => {
  Menu.showMenu(
    0,
    0,
    100,
    250,
    [
      {
        label: 'item 1',
        flags: 0,
      },
      {
        label: 'item 2',
        flags: 0,
      },
    ],
    0,
    -1,
    true
  )
  RendererWorker.state.send = jest.fn()
  const $BackDrop = document.getElementById('BackDrop')
  $BackDrop.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      button: 2,
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.state.send).toHaveBeenCalledWith([7401])
})

test('event - context menu', () => {
  Menu.showMenu(0, 0, 100, 250, [
    {
      label: 'item 1',
      flags: 0,
    },
    {
      label: 'item 2',
      flags: 0,
    },
  ])
  RendererWorker.state.send = jest.fn()
  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
  })
  const $Menu = Menu.state.$$Menus[0]
  $Menu.children[0].dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(RendererWorker.state.send).not.toHaveBeenCalled()
})

test('event - context menu - outside', () => {
  Menu.showMenu(
    0,
    0,
    100,
    250,
    [
      {
        label: 'item 1',
        flags: 0,
      },
      {
        label: 'item 2',
        flags: 0,
      },
    ],
    0,
    -1,
    true
  )
  RendererWorker.state.send = jest.fn()
  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
  })
  const $BackDrop = document.getElementById('BackDrop')
  $BackDrop.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(RendererWorker.state.send).not.toHaveBeenCalled()
})

// TODO test pageup/pagedown
