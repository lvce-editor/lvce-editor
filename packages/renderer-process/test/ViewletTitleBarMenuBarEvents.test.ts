/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import { beforeEach, test, expect, beforeAll } from '@jest/globals'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.ts'
import * as MouseEventTypes from '../src/parts/MouseEventType/MouseEventType.ts'

beforeAll(() => {
  // workaround for jsdom not supporting pointer events
  // @ts-ignore
  globalThis.PointerEvent = class extends Event {
    clientX: any
    clientY: any
    pointerId: any
    button: any
    constructor(type, init) {
      super(type, init)
      this.clientX = init.clientX
      this.clientY = init.clientY
      this.pointerId = init.pointerId
      this.button = init.button
    }
  }

  HTMLElement.prototype.setPointerCapture = () => {}
  HTMLElement.prototype.releasePointerCapture = () => {}

  Object.defineProperty(HTMLElement.prototype, 'onpointerdown', {
    set(fn) {
      this.addEventListener('pointerdown', fn)
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'onpointerup', {
    set(fn) {
      this.addEventListener('pointerup', fn)
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'onpointerover', {
    set(fn) {
      this.addEventListener('pointerover', fn)
    },
  })
})

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.ts', () => {
  return {
    executeViewletCommand: jest.fn(() => {}),
  }
})

const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.ts')
const ViewletTitleBarMenuBar = await import('../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.ts')

test.skip('event - click on menu', () => {
  const state = ViewletTitleBarMenuBar.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletTitleBarMenuBar.attachEvents(state)
  ViewletTitleBarMenuBar.setEntries(state, [
    {
      // @ts-ignore
      id: MenuEntryId.File,
      name: 'File',
      children: [],
    },
    {
      // @ts-ignore
      id: MenuEntryId.Edit,
      name: 'Edit',
      children: [],
    },
    {
      // @ts-ignore
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
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleClick', 0, -1)
})

test.skip('event - click on menu item', () => {
  const state = ViewletTitleBarMenuBar.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletTitleBarMenuBar.attachEvents(state)
  ViewletTitleBarMenuBar.setEntries(state, [
    {
      // @ts-ignore
      id: MenuEntryId.File,
      name: 'File',
      children: [],
    },
    {
      // @ts-ignore
      id: MenuEntryId.Edit,
      name: 'Edit',
      children: [],
    },
    {
      // @ts-ignore
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
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleClick', 0, 1)
})

test.skip('event - mouseover on menu item', () => {
  const state = ViewletTitleBarMenuBar.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletTitleBarMenuBar.attachEvents(state)
  ViewletTitleBarMenuBar.setEntries(state, [
    {
      // @ts-ignore
      id: MenuEntryId.File,
      name: 'File',
      children: [],
    },
    {
      // @ts-ignore
      id: MenuEntryId.Edit,
      name: 'Edit',
      children: [],
    },
    {
      // @ts-ignore
      id: MenuEntryId.Selection,
      name: 'Selection',
      children: [],
    },
  ])
  const { $TitleBarMenuBar } = state
  const event = new PointerEvent('pointerover', {
    clientX: 27,
    clientY: 28,
    bubbles: true,
    cancelable: true,
  })
  $TitleBarMenuBar.children[1].dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleMouseOver', 1)
})

test.skip('event - right click on menu item', () => {
  const state = ViewletTitleBarMenuBar.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletTitleBarMenuBar.attachEvents(state)
  ViewletTitleBarMenuBar.setEntries(state, [
    {
      // @ts-ignore
      id: MenuEntryId.File,
      name: 'File',
      children: [],
    },
    {
      // @ts-ignore
      id: MenuEntryId.Edit,
      name: 'Edit',
      children: [],
    },
    {
      // @ts-ignore
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
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleClick', 2, 1)
})

// TODO test pageup/pagedown

// TODO test mouse enter (with index)
