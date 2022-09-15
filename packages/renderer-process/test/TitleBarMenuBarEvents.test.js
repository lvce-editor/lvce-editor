/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as MouseEventTypes from '../src/parts/MouseEventType/MouseEventType.js'

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
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'TitleBarMenuBar.toggleIndex',
    1
  )
})

test('event - richt click on menu item', () => {
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
    button: MouseEventTypes.RightClick,
  })
  state.$TitleBarMenu.children[1].dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('event - key - ArrowDown', () => {
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
  $TitleBarMenuBar.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowDown',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'TitleBarMenuBar.handleKeyArrowDown'
  )
})

test('event - key - ArrowUp', () => {
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
  $TitleBarMenuBar.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowUp',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'TitleBarMenuBar.handleKeyArrowUp'
  )
})

test('event - key - Enter', () => {
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
  $TitleBarMenuBar.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Enter',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'TitleBarMenuBar.handleKeyEnter'
  )
})

test('event - key - Space', () => {
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
  $TitleBarMenuBar.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: ' ',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'TitleBarMenuBar.handleKeySpace'
  )
})

test('event - key - Home', () => {
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
  $TitleBarMenuBar.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Home',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'TitleBarMenuBar.handleKeyHome'
  )
})

test('event - key - End', () => {
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
  $TitleBarMenuBar.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'End',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'TitleBarMenuBar.handleKeyEnd'
  )
})

test('event - key - Escape', () => {
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
  $TitleBarMenuBar.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Escape',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'TitleBarMenuBar.handleKeyEscape'
  )
})

// TODO test pageup/pagedown

// TODO test mouse enter (with index)
