/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.ts'
import * as DomEventOptions from '../src/parts/DomEventOptions/DomEventOptions.ts'
import * as MouseEventType from '../src/parts/MouseEventType/MouseEventType.js'
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

beforeEach(() => {
  jest.resetAllMocks()
})

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js', () => {
  return {
    executeViewletCommand: jest.fn(() => {}),
  }
})

const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js')
const ViewletEditorImage = await import('../src/parts/ViewletEditorImage/ViewletEditorImage.js')
const ViewletEditorImageEvents = await import('../src/parts/ViewletEditorImage/ViewletEditorImageEvents.js')

test('event - pointerdown', () => {
  const state = ViewletEditorImage.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletEditorImage.attachEvents(state)
  const event = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $Viewlet.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handlePointerDown', 0, 10, 20)
})

test.skip('event - pointerdown - error - no active pointer with the given id is found', () => {
  const spy = jest
    // @ts-ignore
    .spyOn(HTMLElement.prototype, 'setPointerCapture')
    .mockImplementation(() => {
      throw new Error(`DOMException: Failed to execute 'setPointerCapture' on 'Element': No active pointer with the given id is found.`)
    })
  const state = ViewletEditorImage.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  const event = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
  })
  $Viewlet.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handlePointerDown', 0, 10, 20)
})

test('event - pointermove after pointerdown', () => {
  const state = ViewletEditorImage.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletEditorImage.attachEvents(state)
  const pointerDownEvent = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $Viewlet.dispatchEvent(pointerDownEvent)
  const pointerMoveEvent = new PointerEvent('pointermove', {
    bubbles: true,
    clientX: 30,
    clientY: 40,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $Viewlet.dispatchEvent(pointerMoveEvent)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(2)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenNthCalledWith(1, 1, 'handlePointerDown', 0, 10, 20)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenNthCalledWith(2, 1, 'handlePointerMove', 0, 30, 40)
})

test('event - pointerup after pointerdown', () => {
  const state = ViewletEditorImage.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletEditorImage.attachEvents(state)
  const spy1 = jest.spyOn(HTMLElement.prototype, 'addEventListener')
  const spy2 = jest.spyOn(HTMLElement.prototype, 'removeEventListener')
  // @ts-ignore
  const spy3 = jest.spyOn(HTMLElement.prototype, 'setPointerCapture')
  // @ts-ignore
  const spy4 = jest.spyOn(HTMLElement.prototype, 'releasePointerCapture')
  const pointerDownEvent = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  // @ts-ignore
  $Viewlet.dispatchEvent(pointerDownEvent)
  expect(spy1).toHaveBeenCalledTimes(3)
  expect(spy1).toHaveBeenNthCalledWith(1, 'pointermove', ViewletEditorImageEvents.handlePointerMove, DomEventOptions.Active)
  expect(spy1).toHaveBeenNthCalledWith(2, 'pointerup', ViewletEditorImageEvents.handlePointerUp)
  expect(spy1).toHaveBeenNthCalledWith(3, 'lostpointercapture', ViewletEditorImageEvents.handlePointerCaptureLost)
  expect(spy3).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledWith(0)
  const pointerUpEvent = new PointerEvent('pointerup', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $Viewlet.dispatchEvent(pointerUpEvent)
  const pointerLostEvent = new PointerEvent('lostpointercapture', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $Viewlet.dispatchEvent(pointerLostEvent)
  expect(spy4).not.toHaveBeenCalled()
  expect(spy2).toHaveBeenCalledTimes(2)
  expect(spy2).toHaveBeenNthCalledWith(1, 'pointermove', ViewletEditorImageEvents.handlePointerMove)
  expect(spy2).toHaveBeenNthCalledWith(2, 'pointerup', ViewletEditorImageEvents.handlePointerUp)
})

// TODO some other test causes this test to fail
test.skip('event - wheel', () => {
  const state = ViewletEditorImage.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  const { $Image } = state
  const event = new WheelEvent('wheel', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    deltaX: 30,
    deltaY: 40,
  })
  $Image.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleWheel', 10, 20, 30, 40)
})

test.skip('event - contextmenu', () => {
  const state = ViewletEditorImage.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletEditorImage.attachEvents(state)
  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    button: MouseEventType.RightClick,
    cancelable: true,
  })
  $Viewlet.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleContextMenu', 2, 10, 20)
})
