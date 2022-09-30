/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as MouseEventTypes from '../src/parts/MouseEventType/MouseEventType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const ViewletTitleBarMenuBar = await import(
  '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'
)

test('event - click on menu', () => {
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setEntries(state, [
    {
      id: MenuEntryId.File,
      name: 'File',
      children: [],
    },
    {
      id: MenuEntryId.Edit,
      name: 'Edit',
      children: [],
    },
    {
      id: MenuEntryId.Selection,
      name: 'Selection',
      children: [],
    },
  ])
  const event = new MouseEvent('mousedown', {
    clientX: 27,
    clientY: 28,
    bubbles: true,
    cancelable: true,
  })
  const { $TitleBarMenuBar } = state
  $TitleBarMenuBar.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('event - click on menu item', () => {
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setEntries(state, [
    {
      id: MenuEntryId.File,
      name: 'File',
      children: [],
    },
    {
      id: MenuEntryId.Edit,
      name: 'Edit',
      children: [],
    },
    {
      id: MenuEntryId.Selection,
      name: 'Selection',
      children: [],
    },
  ])
  const { $TitleBarMenuBar } = state
  const event = new MouseEvent('mousedown', {
    clientX: 27,
    clientY: 28,
    bubbles: true,
    cancelable: true,
  })
  $TitleBarMenuBar.children[1].dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'TitleBarMenuBar.toggleIndex',
    1
  )
})

test('event - richt click on menu item', () => {
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setEntries(state, [
    {
      id: MenuEntryId.File,
      name: 'File',
      children: [],
    },
    {
      id: MenuEntryId.Edit,
      name: 'Edit',
      children: [],
    },
    {
      id: MenuEntryId.Selection,
      name: 'Selection',
      children: [],
    },
  ])
  const { $TitleBarMenuBar } = state
  const event = new MouseEvent('mousedown', {
    clientX: 27,
    clientY: 28,
    bubbles: true,
    cancelable: true,
    button: MouseEventTypes.RightClick,
  })
  $TitleBarMenuBar.children[1].dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('event - key - ArrowDown', () => {
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setEntries(state, [
    {
      id: MenuEntryId.File,
      name: 'File',
      children: [],
    },
    {
      id: MenuEntryId.Edit,
      name: 'Edit',
      children: [],
    },
    {
      id: MenuEntryId.Selection,
      name: 'Selection',
      children: [],
    },
  ])
  const { $TitleBarMenuBar } = state
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
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setEntries(state, [
    {
      id: MenuEntryId.File,
      name: 'File',
      children: [],
    },
    {
      id: MenuEntryId.Edit,
      name: 'Edit',
      children: [],
    },
    {
      id: MenuEntryId.Selection,
      name: 'Selection',
      children: [],
    },
  ])
  const { $TitleBarMenuBar } = state
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
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setEntries(state, [
    {
      id: MenuEntryId.File,
      name: 'File',
      children: [],
    },
    {
      id: MenuEntryId.Edit,
      name: 'Edit',
      children: [],
    },
    {
      id: MenuEntryId.Selection,
      name: 'Selection',
      children: [],
    },
  ])
  const { $TitleBarMenuBar } = state
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
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setEntries(state, [
    {
      id: MenuEntryId.File,
      name: 'File',
      children: [],
    },
    {
      id: MenuEntryId.Edit,
      name: 'Edit',
      children: [],
    },
    {
      id: MenuEntryId.Selection,
      name: 'Selection',
      children: [],
    },
  ])
  const { $TitleBarMenuBar } = state
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
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setEntries(state, [
    {
      id: MenuEntryId.File,
      name: 'File',
      children: [],
    },
    {
      id: MenuEntryId.Edit,
      name: 'Edit',
      children: [],
    },
    {
      id: MenuEntryId.Selection,
      name: 'Selection',
      children: [],
    },
  ])
  const { $TitleBarMenuBar } = state
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
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setEntries(state, [
    {
      id: MenuEntryId.File,
      name: 'File',
      children: [],
    },
    {
      id: MenuEntryId.Edit,
      name: 'Edit',
      children: [],
    },
    {
      id: MenuEntryId.Selection,
      name: 'Selection',
      children: [],
    },
  ])
  const { $TitleBarMenuBar } = state
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
  const state = ViewletTitleBarMenuBar.create()
  ViewletTitleBarMenuBar.setEntries(state, [
    {
      id: MenuEntryId.File,
      name: 'File',
      children: [],
    },
    {
      id: MenuEntryId.Edit,
      name: 'Edit',
      children: [],
    },
    {
      id: MenuEntryId.Selection,
      name: 'Selection',
      children: [],
    },
  ])
  const { $TitleBarMenuBar } = state
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
