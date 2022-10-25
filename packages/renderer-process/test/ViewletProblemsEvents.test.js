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

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const ViewletProblems = await import(
  '../src/parts/ViewletProblems/ViewletProblems.js'
)

test('event - pointerdown', () => {
  const state = ViewletProblems.create()
  const event = new MouseEvent('pointerdown', {
    bubbles: true,
    clientX: 15,
    clientY: 30,
    cancelable: true,
  })
  const { $Viewlet } = state
  $Viewlet.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Problems.focusIndex', -1)
  expect(event.defaultPrevented).toBe(true)
})
