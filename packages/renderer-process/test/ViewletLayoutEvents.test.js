/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as MouseEventType from '../src/parts/MouseEventType/MouseEventType.js'
import * as DomEventType from '../src/parts/DomEventType/DomEventType.js'

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

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.js', () => {
  return {
    send: jest.fn(),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.js')

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.js')
const ViewletLayoutEvents = await import('../src/parts/ViewletLayout/ViewletLayoutEvents.js')

test('event - pointermove after pointerdown', () => {
  const state = ViewletLayout.create()
  ViewletLayout.attachEvents(state)
  const { $SashSideBar } = state
  const pointerDownEvent = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $SashSideBar.dispatchEvent(pointerDownEvent)
  const pointerMoveEvent = new PointerEvent('pointermove', {
    bubbles: true,
    clientX: 30,
    clientY: 40,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $SashSideBar.dispatchEvent(pointerMoveEvent)
  expect(RendererWorker.send).toHaveBeenCalledTimes(2)
  expect(RendererWorker.send).toHaveBeenNthCalledWith(1, 'Layout.handleSashPointerDown', 'SideBar')
  expect(RendererWorker.send).toHaveBeenNthCalledWith(2, 'Layout.handleSashPointerMove', 30, 40)
})

test('event - pointerup after pointerdown', () => {
  const state = ViewletLayout.create()
  ViewletLayout.attachEvents(state)
  const spy1 = jest.spyOn(HTMLElement.prototype, 'addEventListener')
  const spy2 = jest.spyOn(HTMLElement.prototype, 'removeEventListener')
  // @ts-ignore
  const spy3 = jest.spyOn(HTMLElement.prototype, 'setPointerCapture')
  // @ts-ignore
  const spy4 = jest.spyOn(HTMLElement.prototype, 'releasePointerCapture')
  const { $SashSideBar } = state
  const pointerDownEvent = new PointerEvent(DomEventType.PointerDown, {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  // @ts-ignore
  $SashSideBar.dispatchEvent(pointerDownEvent)
  expect(spy1).toHaveBeenCalledTimes(2)
  expect(spy1).toHaveBeenNthCalledWith(1, DomEventType.PointerMove, ViewletLayoutEvents.handleSashPointerMove)
  expect(spy1).toHaveBeenNthCalledWith(2, DomEventType.LostPointerCapture, ViewletLayoutEvents.handlePointerCaptureLost)
  expect(spy3).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledWith(0)
  const pointerUpEvent = new PointerEvent(DomEventType.PointerUp, {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $SashSideBar.dispatchEvent(pointerUpEvent)
  const pointerLostEvent = new PointerEvent(DomEventType.LostPointerCapture, {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $SashSideBar.dispatchEvent(pointerLostEvent)
  expect(spy4).not.toHaveBeenCalled()
  expect(spy2).toHaveBeenCalledTimes(2)
  expect(spy2).toHaveBeenNthCalledWith(1, DomEventType.PointerMove, ViewletLayoutEvents.handleSashPointerMove)
  expect(spy2).toHaveBeenNthCalledWith(2, DomEventType.LostPointerCapture, ViewletLayoutEvents.handlePointerCaptureLost)
})
