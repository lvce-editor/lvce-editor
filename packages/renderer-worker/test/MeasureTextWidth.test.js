import * as MeasureTextWidth from '../src/parts/MeasureTextWidth/MeasureTextWidth.js'

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
  expect(MeasureTextWidth.state.ctx._font).toBe("400 15px 'Test Font'")
})
