/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as MouseEventType from '../src/parts/MouseEventType/MouseEventType.ts'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.ts'
import { beforeEach, test, expect, beforeAll } from '@jest/globals'

beforeAll(() => {
  // workaround for jsdom not supporting pointer events
  // @ts-ignore
  globalThis.PointerEvent = class extends Event {
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
})

beforeAll(() => {
  // workaround for jsdom not supporting Touch constructor
  // @ts-ignore
  globalThis.Touch = class {
    constructor(init) {
      this.clientX = init.clientX
      this.clientY = init.clientY
      this.identifier = init.identifier
    }
  }
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
const ViewletExtensions = await import('../src/parts/ViewletExtensions/ViewletExtensions.ts')

test('event - touchstart', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
  const { $ListItems } = state
  const event = new TouchEvent('touchstart', {
    bubbles: true,
    cancelable: true,
    changedTouches: [
      new Touch({
        identifier: 0,
        clientX: 10,
        clientY: 10,
        target: $ListItems,
      }),
    ],
  })
  $ListItems.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleTouchStart', expect.any(Number), [
    { x: 10, y: 10, identifier: 0 },
  ])
})

test('event - touchmove', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
  const { $ListItems } = state
  const event = new TouchEvent('touchmove', {
    bubbles: true,
    cancelable: true,
    changedTouches: [
      new Touch({
        identifier: 0,
        clientX: 10,
        clientY: 10,
        target: $ListItems,
      }),
    ],
  })
  $ListItems.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleTouchMove', expect.any(Number), [
    { x: 10, y: 10, identifier: 0 },
  ])
})

test('event - touchend', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
  const { $ListItems } = state
  const event = new TouchEvent('touchend', {
    bubbles: true,
    cancelable: true,
    changedTouches: [
      new Touch({
        identifier: 0,
        clientX: 10,
        clientY: 10,
        target: $ListItems,
      }),
    ],
  })
  $ListItems.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleTouchEnd', [{ x: 10, y: 10, identifier: 0 }])
})

test('event - pointerdown - on scroll bar thumb', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
  const { $ScrollBarThumb } = state
  const event = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $ScrollBarThumb.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleScrollBarClick', 20)
})

test('event - contextmenu - activated via keyboard', () => {
  const state = ViewletExtensions.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensions.attachEvents(state)
  const { $ListItems } = state
  $ListItems.dispatchEvent(
    new MouseEvent('contextmenu', {
      clientX: 50,
      clientY: 50,
      bubbles: true,
      button: -1,
    }),
  )
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleContextMenu', -1, 50, 50)
})
