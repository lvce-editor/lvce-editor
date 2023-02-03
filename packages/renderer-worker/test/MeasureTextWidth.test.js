import * as MeasureTextWidth from '../src/parts/MeasureTextWidth/MeasureTextWidth.js'
import * as MeasureTextWidthState from '../src/parts/MeasureTextWidthState/MeasureTextWidthState.js'

beforeAll(() => {
  // @ts-ignore
  globalThis.OffscreenCanvasRenderingContext2D = class {
    constructor() {}

    set font(value) {
      this._font = value
    }

    get font() {
      return this._font
    }

    measureText(text) {
      return {
        width: text.length * 10,
      }
    }
  }
  // @ts-ignore
  globalThis.OffscreenCanvas = class {
    constructor() {
      this._context = new OffscreenCanvasRenderingContext2D()
    }

    getContext() {
      return this._context
    }
  }
})

test('measureTextWidth', () => {
  expect(MeasureTextWidth.measureTextWidth('test', 400, 15, "'Test Font'", 0.5)).toBe(40)
  // @ts-ignore
  expect(MeasureTextWidthState.state.ctx._font).toBe("400 15px 'Test Font'")
})

test('measureTextWidth - letter-spacing string', () => {
  expect(() => MeasureTextWidth.measureTextWidth('test', 400, 15, "'Test Font'", 'normal')).toThrowError(
    new Error(`letterSpacing must be of type number`)
  )
})
