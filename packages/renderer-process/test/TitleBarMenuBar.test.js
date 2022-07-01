/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const TitleBarMenuBar = await import(
  '../src/parts/TitleBarMenuBar/TitleBarMenuBar.js'
)
const Menu = await import('../src/parts/OldMenu/Menu.js')

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
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
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
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('event - click on menu item', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
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
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith([
    'TitleBarMenuBar.toggleIndex',
    1,
  ])
})

test.skip('event - key - ArrowDown', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
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
  expect(RendererWorker.send).toHaveBeenCalledWith([4618])
})

test.skip('event - key - ArrowUp', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
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
  expect(RendererWorker.send).toHaveBeenCalledWith([4619])
})

test.skip('event - key - Enter', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
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
  expect(RendererWorker.send).toHaveBeenCalledWith([4624])
})

test.skip('event - key - Space', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
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
  expect(RendererWorker.send).toHaveBeenCalledWith([4623])
})

test.skip('event - key - Home', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
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
  expect(RendererWorker.send).toHaveBeenCalledWith([4621])
})

test.skip('event - key - End', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
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
  expect(RendererWorker.send).toHaveBeenCalledWith([4622])
})

test.skip('event - key - Escape', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
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
  expect(RendererWorker.send).toHaveBeenCalledWith([4625])
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
