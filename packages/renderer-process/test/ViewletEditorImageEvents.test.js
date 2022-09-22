/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as MouseEventType from '../src/parts/MouseEventType/MouseEventType.js'

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

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(() => {}),
    }
  }
)

const ViewletEditorImage = await import(
  '../src/parts/ViewletEditorImage/ViewletEditorImage.js'
)
const ViewletEditorImageEvents = await import(
  '../src/parts/ViewletEditorImage/ViewletEditorImageEvents.js'
)
const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

test('event - pointerdown', () => {
  const state = ViewletEditorImage.create()
  const { $Viewlet } = state
  const event = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  $Viewlet.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'EditorImage.handlePointerDown',
    0,
    10,
    20
  )
})

test.skip('event - pointerdown - error - no active pointer with the given id is found', () => {
  const spy = jest
    // @ts-ignore
    .spyOn(HTMLElement.prototype, 'setPointerCapture')
    .mockImplementation(() => {
      throw new Error(
        `DOMException: Failed to execute 'setPointerCapture' on 'Element': No active pointer with the given id is found.`
      )
    })
  const state = ViewletEditorImage.create()
  const { $Viewlet } = state
  const event = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
  })
  $Viewlet.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'EditorImage.handlePointerDown',
    0,
    10,
    20
  )
})

test('event - pointermove after pointerdown', () => {
  const state = ViewletEditorImage.create()
  const { $Viewlet } = state
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
  expect(RendererWorker.send).toHaveBeenCalledTimes(2)
  expect(RendererWorker.send).toHaveBeenNthCalledWith(
    1,
    'EditorImage.handlePointerDown',
    0,
    10,
    20
  )
  expect(RendererWorker.send).toHaveBeenNthCalledWith(
    2,
    'EditorImage.handlePointerMove',
    0,
    30,
    40
  )
})

test('event - pointerup after pointerdown', () => {
  const state = ViewletEditorImage.create()
  const spy1 = jest.spyOn(HTMLElement.prototype, 'addEventListener')
  // @ts-ignore
  const spy3 = jest.spyOn(HTMLElement.prototype, 'setPointerCapture')
  // @ts-ignore
  const spy4 = jest.spyOn(HTMLElement.prototype, 'releasePointerCapture')
  const { $Viewlet } = state
  const pointerDownEvent = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
    button: MouseEventType.LeftClick,
  })
  // @ts-ignore
  $Viewlet.dispatchEvent(pointerDownEvent)
  expect(spy1).not.toHaveBeenCalled()
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
  expect(spy4).toHaveBeenCalledTimes(1)
  expect(spy4).toHaveBeenCalledWith(0)
})

// TODO some other test causes this test to fail
test.skip('event - wheel', () => {
  const state = ViewletEditorImage.create()
  const { $Image } = state
  const event = new WheelEvent('wheel', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    deltaX: 30,
    deltaY: 40,
  })
  $Image.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'EditorImage.handleWheel',
    10,
    20,
    30,
    40
  )
})
