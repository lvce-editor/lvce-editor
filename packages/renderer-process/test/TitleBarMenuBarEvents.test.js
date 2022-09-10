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
