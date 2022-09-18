/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeAll(() => {
  // workaround for jsdom not supporting pointer events
  // @ts-ignore
  globalThis.PointerEvent = class extends Event {
    constructor(type, init) {
      super(type, init)
      this.clientX = init.clientX
      this.clientY = init.clientY
      this.pointerId = init.pointerId
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
  ViewletEditorImageEvents.state.pointerDownCount = 0
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
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
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
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = ViewletEditorImage.create()
  const { $Viewlet } = state
  const pointerDownEvent = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
  })
  $Viewlet.dispatchEvent(pointerDownEvent)
  const pointerMoveEvent = new PointerEvent('pointermove', {
    bubbles: true,
    clientX: 30,
    clientY: 40,
    pointerId: 0,
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
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = ViewletEditorImage.create()
  const spy1 = jest.spyOn(HTMLElement.prototype, 'addEventListener')
  const spy2 = jest.spyOn(HTMLElement.prototype, 'removeEventListener')
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
  })
  $Viewlet.dispatchEvent(pointerDownEvent)
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenNthCalledWith(
    1,
    'pointermove',
    ViewletEditorImageEvents.handlePointerMove,
    { passive: true }
  )
  expect(spy3).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledWith(0)
  const pointerUpEvent = new PointerEvent('pointerup', {
    bubbles: true,
    clientX: 10,
    clientY: 20,
    pointerId: 0,
  })
  $Viewlet.dispatchEvent(pointerUpEvent)
  // expect(spy2).toHaveBeenCalledTimes(2)
  // expect(spy2).toHaveBeenNthCalledWith(
  //   1,
  //   'pointermove',
  //   ViewletEditorImageEvents.handlePointerMove,
  //   { passive: true }
  // )
  // expect(spy2).toHaveBeenNthCalledWith(
  //   2,
  //   'pointerup',
  //   ViewletEditorImageEvents.handlePointerUp
  // )
  expect(spy4).toHaveBeenCalledTimes(1)
  expect(spy4).toHaveBeenCalledWith(0)
})

// TODO some other test causes this test to fail
test.skip('event - wheel', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
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

test('dispose', () => {
  const state = ViewletEditorImage.create()
  const spy = jest.spyOn(window, 'removeEventListener')
  ViewletEditorImage.dispose(state)
  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    'pointerup',
    ViewletEditorImageEvents.handlePointerUp
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    'pointermove',
    ViewletEditorImageEvents.handlePointerMove
  )
})
