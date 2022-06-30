/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.js'
import * as TitleBarMenuBar from '../src/parts/TitleBarMenuBar/TitleBarMenuBar.js'
import * as Menu from '../src/parts/OldMenu/Menu.js'

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

test('event - click on menu', () => {
  RendererWorker.state.send = jest.fn()
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
  const $TitleBarMenuBar = TitleBarMenuBar.create()
  const state = {
    $TitleBarMenu: $TitleBarMenuBar,
  }
  TitleBarMenuBar.setEntries(state, titleBarMenuEntries)
  const event = new MouseEvent('mousedown', {
    clientX: 27,
    clientY: 28,
    bubbles: true,
    cancelable: true,
  })
  state.$TitleBarMenu.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(RendererWorker.state.send).not.toHaveBeenCalled()
})

test('event - click on menu item', () => {
  RendererWorker.state.send = jest.fn()
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
  const $TitleBarMenuBar = TitleBarMenuBar.create()
  const state = {
    $TitleBarMenu: $TitleBarMenuBar,
  }
  TitleBarMenuBar.setEntries(state, titleBarMenuEntries)
  const event = new MouseEvent('mousedown', {
    clientX: 27,
    clientY: 28,
    bubbles: true,
    cancelable: true,
  })
  state.$TitleBarMenu.children[1].dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(RendererWorker.state.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.state.send).toHaveBeenCalledWith([
    'TitleBarMenuBar.handleClick',
    1,
  ])
})

test.skip('event - key - ArrowDown', () => {
  RendererWorker.state.send = jest.fn()
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
  $TitleBarMenuBar.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowDown',
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledWith([4618])
})

test.skip('event - key - ArrowUp', () => {
  RendererWorker.state.send = jest.fn()
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
  $TitleBarMenuBar.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowUp',
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledWith([4619])
})

test.skip('event - key - Enter', () => {
  RendererWorker.state.send = jest.fn()
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
  $TitleBarMenuBar.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Enter',
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledWith([4624])
})

test.skip('event - key - Space', () => {
  RendererWorker.state.send = jest.fn()
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
  $TitleBarMenuBar.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: ' ',
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledWith([4623])
})

test.skip('event - key - Home', () => {
  RendererWorker.state.send = jest.fn()
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
  $TitleBarMenuBar.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Home',
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledWith([4621])
})

test.skip('event - key - End', () => {
  RendererWorker.state.send = jest.fn()
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
  $TitleBarMenuBar.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'End',
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledWith([4622])
})

test.skip('event - key - Escape', () => {
  RendererWorker.state.send = jest.fn()
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
  $TitleBarMenuBar.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Escape',
    })
  )
  expect(RendererWorker.state.send).toHaveBeenCalledWith([4625])
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
