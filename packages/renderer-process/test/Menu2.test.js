/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.js', () => {
  return {
    send: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.js')

const Menu = await import('../src/parts/OldMenu/Menu2.js')

const getTextContent = (node) => {
  return node.textContent
}

const getSimpleList = ($Menu) => {
  return Array.from($Menu.children).map(getTextContent)
}

test('show', () => {
  Menu.show(0, 0, 0, [
    {
      label: 'item 1',
      flags: 0,
    },
    {
      label: '__Separator',
      flags: 1,
    },
    {
      label: 'item 2',
      flags: 2,
    },
    {
      label: 'item 3',
      flags: 3,
    },
  ])
  expect(getSimpleList(Menu.state.$$Menus[0])).toEqual(['item 1', '', 'item 2', 'item 3'])
})

test('show - with invalid item', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  Menu.show(0, 0, 0, [
    {
      label: 'item 1',
    },
  ])
  expect(spy).toHaveBeenCalledWith('invalid menu item flags: "undefined"')
})

test.skip('closeUntil', () => {
  // const $FocusedElement = document.createElement('textarea')
  // document.body.append($FocusedElement)
  // $FocusedElement.focus()
  // @ts-ignore
  Menu.show(0, 0, [
    {
      label: 'item 1',
      flags: 0,
    },
  ])
  Menu.closeUntil(0)
  expect(document.querySelector('#Widgets').children).toHaveLength(0)
  // expect(document.activeElement).toBe($FocusedElement)
})

test('event - mousedown', () => {
  Menu.show(0, 0, 0, [
    {
      label: 'item 1',
      flags: 0,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const $MenuItemOne = Menu.state.$$Menus[0].firstChild
  $MenuItemOne.dispatchEvent(
    new Event('mousedown', {
      bubbles: true,
      cancelable: true,
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('Menu.selectIndex', 0, 0)
})

test.skip('event - key - ArrowDown', () => {
  Menu.show(0, 0, 0, [
    {
      label: 'item 1',
      flags: 0,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  Menu.state.$$Menus[0].dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowDown',
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([958])
})

test.skip('event - key - ArrowUp', () => {
  // @ts-ignore
  Menu.show(0, 0, [
    {
      label: 'item 1',
      flags: 0,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  Menu.state.$Menu.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowUp',
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([959])
})

test.skip('event - key - Enter', () => {
  Menu.show(0, 0, 0, [
    {
      label: 'item 1',
      flags: 0,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  Menu.state.$Menu.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Enter',
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([960])
})

test.skip('event - key - Space', () => {
  // @ts-ignore
  Menu.show(0, 0, [
    {
      label: 'item 1',
      flags: 0,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  Menu.state.$Menu.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: ' ',
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([961])
})

test.skip('event - key - Home', () => {
  // @ts-ignore
  Menu.show(0, 0, [
    {
      label: 'item 1',
      flags: 0,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  Menu.state.$Menu.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Home',
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([962])
})

test.skip('event - key - End', () => {
  // @ts-ignore
  Menu.show(0, 0, [
    {
      label: 'item 1',
      flags: 0,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  Menu.state.$Menu.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'End',
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([963])
})

test.skip('event - key - Escape', () => {
  // @ts-ignore
  Menu.show(0, 0, [
    {
      label: 'item 1',
      flags: 0,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  Menu.state.$Menu.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Escape',
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([964])
})

test.skip('event - click - outside', () => {
  // @ts-ignore
  Menu.show(0, 0, [
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
  Menu.state.$Menu.dispatchEvent(
    new Event('mousedown', {
      bubbles: true,
      cancelable: true,
    }),
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test.skip('adjust position when it is near edge of screen', () => {
  // @ts-ignore
  window.innerWidth = 600
  // @ts-ignore
  window.innerHeight = 600
  // @ts-ignore
  Menu.show(window.innerWidth, window.innerHeight, [
    {
      label: 'item 1',
      flags: 0,
    },
    {
      label: 'item 2',
      flags: 0,
    },
  ])
  expect(Menu.state.$Menu.style.left).toBe('351px')
  expect(Menu.state.$Menu.style.top).toBe('525px')
})

// TODO test pageup/pagedown
