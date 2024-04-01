/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as AriaBoolean from '../src/parts/AriaBoolean/AriaBoolean.js'
import * as DomAttributeType from '../src/parts/DomAttributeType/DomAttributeType.ts'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.js'

beforeEach(() => {
  jest.resetAllMocks()
  Menu.state.$$Menus = []
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.js', () => {
  return {
    send: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.js')
const Menu = await import('../src/parts/OldMenu/Menu.js')

const getTextContent = ($Node) => {
  return $Node.textContent
}
const getSimpleList = ($Menu) => {
  return Array.from($Menu.children).map(getTextContent)
}

test.skip('showControlled', () => {
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
        flags: MenuItemFlags.Separator,
      },
      {
        id: 'item-2',
        label: 'item 2',
        flags: MenuItemFlags.Checked,
      },
      {
        id: 'item-3',
        label: 'item 3',
        flags: MenuItemFlags.Unchecked,
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
  expect(getSimpleList(Menu.state.$$Menus[0])).toEqual(['item 1', '', 'item 2', 'item 3'])
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
        flags: MenuItemFlags.Separator,
      },
      {
        id: 'item-2',
        label: 'item 2',
        flags: MenuItemFlags.Checked,
      },
      {
        id: 'item-3',
        label: 'item 3',
        flags: MenuItemFlags.Unchecked,
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

test.skip('accessibility - Menu show have role menu', () => {
  Menu.showControlled({
    x: 0,
    y: 0,
    items: [
      {
        id: 'item-1',
        label: 'item 1',
        flags: MenuItemFlags.None,
      },
      {
        label: '__Separator',
        flags: MenuItemFlags.Separator,
      },
      {
        id: 'item-2',
        label: 'item 2',
        flags: MenuItemFlags.Checked,
      },
      {
        id: 'item-3',
        label: 'item 3',
        flags: MenuItemFlags.Unchecked,
      },
    ],
    handleKeyDown() {},
    $Parent: undefined,
    handleFocusOut() {},
    level: 0,
    width: 100,
    height: 100,
  })
  expect(Menu.state.$$Menus[0].role).toBe('menu')
})

test.skip('accessibility - MenuItem show have role menuitem or separator', () => {
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
        flags: MenuItemFlags.Separator,
      },
      {
        id: 'item-2',
        label: 'item 2',
        flags: MenuItemFlags.Checked,
      },
      {
        id: 'item-3',
        label: 'item 3',
        flags: MenuItemFlags.Unchecked,
      },
    ],
    handleKeyDown() {},
    height: 100,
    width: 100,
  })
  const $Menu = Menu.state.$$Menus[0]
  expect($Menu.firstChild.role).toBe('menuitem')
  expect($Menu.children[1].role).toBe('separator')
})

test.skip('showMenu - error - item has missing flags', () => {
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

test.skip('showMenu - error - item has missing label', () => {
  console.warn = jest.fn()
  Menu.showMenu(0, 0, 100, 250, [
    {
      flags: MenuItemFlags.Checked,
      label: undefined,
    },
  ])
  expect(console.warn).toHaveBeenCalledTimes(1)
  expect(console.warn).toHaveBeenCalledWith('menu item has missing label', {
    flags: MenuItemFlags.Checked,
    label: undefined,
  })
  const $Menu = Menu.state.$$Menus[0]
  expect($Menu.children[0].textContent).toBe('n/a')
})

test.skip('showMenu - with sub menu', () => {
  Menu.showMenu(
    0,
    0,
    100,
    100,
    [
      {
        id: 'newFile',
        label: 'New File',
        flags: MenuItemFlags.Disabled,
      },
      {
        id: 'newWindow',
        label: 'New Window',
        flags: MenuItemFlags.None,
      },
      {
        id: 'separator',
        label: 'Separator',
        flags: MenuItemFlags.Separator,
      },
      {
        id: 'openFile',
        label: 'Open File',
        flags: MenuItemFlags.Disabled,
      },
      {
        id: 'openFolder',
        label: 'Open Folder',
        flags: MenuItemFlags.None,
      },
      {
        id: 'openRecent',
        label: 'Open Recent',
        flags: MenuItemFlags.SubMenu,
      },
      {
        id: 'separator',
        label: 'Separator',
        flags: MenuItemFlags.Separator,
      },
      {
        id: 'exit',
        label: 'Exit',
        flags: MenuItemFlags.None,
      },
    ],
    0,
    -1,
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
        flags: MenuItemFlags.Separator,
      },
      {
        id: 'more',
        label: 'More...',
        flags: MenuItemFlags.None,
      },
      {
        id: 'separator',
        label: 'Separator',
        flags: MenuItemFlags.Separator,
      },
      {
        id: 'clearRecentlyOpened',
        label: 'Clear Recently Opened',
        flags: MenuItemFlags.None,
      },
    ],
    1,
    5,
  )
  const $Menu = Menu.state.$$Menus[0]
  const $SubMenu = Menu.state.$$Menus[1]
  expect($Menu.children).toHaveLength(8)
  expect($SubMenu.children).toHaveLength(4)

  const $MenuItemOpenRecent = $Menu.children[5]
  expect($MenuItemOpenRecent.textContent).toBe('Open Recent')
  expect($MenuItemOpenRecent.ariaExpanded).toBe(AriaBoolean.True)
  expect($MenuItemOpenRecent.getAttribute(DomAttributeType.AriaOwns)).toBe('Menu-1')
})

test.skip('event - click', () => {
  Menu.showMenu(0, 0, 100, 250, [
    {
      label: 'item 1',
      flags: 0,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const $Menu = Menu.state.$$Menus[0]
  $Menu.children[0].dispatchEvent(
    new Event('mousedown', {
      bubbles: true,
      cancelable: true,
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('Menu.selectIndex', 0, 0)
})

test.skip('event - click - outside', () => {
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
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const $Menu = Menu.state.$$Menus[0]
  $Menu.dispatchEvent(
    new Event('mousedown', {
      bubbles: true,
      cancelable: true,
    }),
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test.skip('event - right click outside', () => {
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
    true,
  )
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const $BackDrop = document.querySelector('.BackDrop')
  $BackDrop.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      button: MenuItemFlags.Checked,
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(2)
  expect(RendererWorker.send).toHaveBeenCalledWith('Menu.hide')
})

test.skip('event - mouseleave - outside', () => {
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
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const $Menu = Menu.state.$$Menus[0]
  const $RelatedTarget = document.createElement('div')
  $RelatedTarget.className = 'MenuItem'
  $Menu.dispatchEvent(
    new MouseEvent('mouseleave', {
      bubbles: true,
      cancelable: true,
      relatedTarget: $RelatedTarget,
    }),
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test.skip('event - mouseleave - outside', () => {
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
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const $Menu = Menu.state.$$Menus[0]
  $Menu.dispatchEvent(
    new MouseEvent('mouseleave', {
      bubbles: true,
      cancelable: true,
      relatedTarget: document.createElement('div'),
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Menu.handleMouseLeave')
})

test.skip('event - context menu', () => {
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
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
  })
  const $Menu = Menu.state.$$Menus[0]
  $Menu.children[0].dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test.skip('event - context menu - outside', () => {
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
    true,
  )
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
  })
  const $BackDrop = document.querySelector('.BackDrop')
  $BackDrop.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Focus.setFocus', WhenExpression.FocusMenu)
})

// TODO test pageup/pagedown
