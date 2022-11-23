/**
 * @jest-environment jsdom
 */
import * as ViewletEditorImage from '../src/parts/ViewletEditorImage/ViewletEditorImage.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

beforeAll(() => {
  // workaround for jsdom not supporting DOMMatrixReadonly
  // @ts-ignore
  globalThis.DOMMatrixReadOnly = class {
    constructor([a = 1, b = 0, c = 0, d = 1, e = 0, f = 0] = []) {
      this.a = a
      this.b = b
      this.c = c
      this.d = d
      this.e = e
      this.f = f
    }

    translate(deltaX = 0, deltaY = 0) {
      return new DOMMatrixReadOnly([
        this.a,
        this.b,
        this.c,
        this.d,
        this.e + this.a * deltaX,
        this.f + this.d * deltaY,
      ])
    }
  }

  // @ts-ignore
  globalThis.DOMMatrix = class {
    constructor([a = 1, b = 0, c = 0, d = 1, e = 0, f = 0] = []) {
      this.a = a
      this.b = b
      this.c = c
      this.d = d
      this.e = e
      this.f = f
    }

    translateSelf(deltaX = 0, deltaY = 0) {
      this.e += deltaX * this.a
      this.f += deltaY * this.d
      return this
    }

    translate(deltaX, deltaY) {
      return new DOMMatrix([
        this.a,
        this.b,
        this.c,
        this.d,
        this.e + this.a * deltaX,
        this.f + this.d * deltaY,
      ])
    }

    scaleSelf(scaleX = 1, scaleY = scaleX) {
      this.a *= scaleX
      this.d *= scaleY
      return this
    }

    multiplySelf(domMatrix) {
      const newA = this.a * domMatrix.a + this.b * domMatrix.c
      const newB = this.a * domMatrix.b + this.b * domMatrix.d
      const newC = this.c * domMatrix.a + this.d * domMatrix.c
      const newD = this.c * domMatrix.b + this.d * domMatrix.d
      const newE = this.e * domMatrix.a + this.f * domMatrix.c
      const newF = this.e * domMatrix.b + this.f * domMatrix.d
      this.a = newA
      this.b = newB
      this.c = newC
      this.d = newD
      this.e = newE
      this.f = newF
      return this
    }
  }
})

const ViewletManager = await import(
  '../src/parts/ViewletManager/ViewletManager.js'
)

const render = (oldState, newState) => {
  return ViewletManager.render(
    ViewletEditorImage,
    oldState,
    newState,
    ViewletModuleId.EditorImage
  )
}

test('create', () => {
  const state = ViewletEditorImage.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = {
    ...ViewletEditorImage.create(),
    uri: '/test/image.png',
  }
  expect(await ViewletEditorImage.loadContent(state)).toMatchObject({
    src: '/remote/test/image.png',
  })
})

test('dispose', async () => {
  const state = {
    ...ViewletEditorImage.create(),
    uri: '/test/image.png',
  }
  expect(await ViewletEditorImage.dispose(state)).toMatchObject({
    disposed: true,
  })
})

test('render', () => {
  const oldState = ViewletEditorImage.create()
  const newState = {
    ...oldState,
    src: '/test/image.png',
  }
  expect(render(oldState, newState)).toEqual([
    ['Viewlet.send', 'EditorImage', 'setSrc', '/test/image.png'],
  ])
})

test('handlePointerMove - move left', () => {
  const state = {
    ...ViewletEditorImage.create(),
    eventCache: [
      {
        pointerId: 5,
        x: 210.5,
        y: 165.5,
      },
    ],
  }
  const newState = ViewletEditorImage.handlePointerMove(state, 5, -10, 0)
  expect(newState.domMatrix.e).toBe(-10)
  expect(newState.eventCache).toEqual([
    {
      pointerId: 5,
      x: -10,
      y: 0,
    },
  ])
})

test('handlePointerMove - move right', () => {
  const state = {
    ...ViewletEditorImage.create(),
    eventCache: [
      {
        pointerId: 5,
        x: 210.5,
        y: 165.5,
      },
    ],
  }
  const newState = ViewletEditorImage.handlePointerMove(state, 5, 10, 0)
  expect(newState.domMatrix.e).toBe(10)
})

test('handlePointerMove - move up', () => {
  const state = {
    ...ViewletEditorImage.create(),
    eventCache: [
      {
        pointerId: 5,
        x: 210.5,
        y: 165.5,
      },
    ],
  }
  const newState = ViewletEditorImage.handlePointerMove(state, 5, 0, -10)
  expect(newState.domMatrix.f).toBe(-10)
})

test('handlePointerMove - move down', () => {
  const state = {
    ...ViewletEditorImage.create(),
    eventCache: [
      {
        pointerId: 5,
        x: 210.5,
        y: 165.5,
      },
    ],
  }
  const newState = ViewletEditorImage.handlePointerMove(state, 5, 0, 10)
  expect(newState.domMatrix.f).toBe(10)
})

test('handlePointerMove - move right after zoom', () => {
  const state = {
    ...ViewletEditorImage.create(),
    domMatrix: new DOMMatrix([2, 0, 0, 2, 0, 0]),
    eventCache: [
      {
        pointerId: 5,
        x: 210.5,
        y: 165.5,
      },
    ],
  }
  const newState = ViewletEditorImage.handlePointerMove(state, 5, 10, 20)
  expect(newState.domMatrix.e).toBe(10)
  expect(newState.domMatrix.f).toBe(20)
})

test('handlePointerDown', () => {
  const state = ViewletEditorImage.create()
  const newState = ViewletEditorImage.handlePointerDown(state, 0, 10, 20)
  expect(newState.pointerOffsetX).toBe(10)
  expect(newState.pointerOffsetY).toBe(20)
})

test('handleWheel - no zoom', () => {
  const state = ViewletEditorImage.create()
  const newState = ViewletEditorImage.handleWheel(state, 0, 0, 0, 0)
  expect(newState).toBe(state)
})

test('handleWheel - zoom in', () => {
  const state = {
    ...ViewletEditorImage.create(),
    top: 0,
    left: 0,
  }
  const newState = ViewletEditorImage.handleWheel(state, 0, 0, 0, -26)
  expect(newState.domMatrix.a).toBe(1.13)
  expect(newState.domMatrix.b).toBe(0)
  expect(newState.domMatrix.c).toBe(0)
  expect(newState.domMatrix.d).toBe(1.13)
  expect(newState.domMatrix.e).toBe(0)
  expect(newState.domMatrix.f).toBe(0)
})

test('handleWheel - zoom in twice', () => {
  const state = {
    ...ViewletEditorImage.create(),
    top: 0,
    left: 0,
    domMatrix: new DOMMatrix([1.13, 0, 0, 1.13, 0, 0]),
  }
  const newState = ViewletEditorImage.handleWheel(state, 0, 0, 0, -26)
  expect(newState.domMatrix.a).toBe(1.2768999999999997)
  expect(newState.domMatrix.b).toBe(0)
  expect(newState.domMatrix.c).toBe(0)
  expect(newState.domMatrix.d).toBe(1.2768999999999997)
  expect(newState.domMatrix.e).toBe(0)
  expect(newState.domMatrix.f).toBe(0)
})

test('handleWheel - zoom in at top left - should move image to bottom right', () => {
  const state = {
    ...ViewletEditorImage.create(),
    top: 0,
    left: 0,
  }
  const newState = ViewletEditorImage.handleWheel(state, 14, 11, 0, -26)
  expect(newState.domMatrix.a).toBe(1.13)
  expect(newState.domMatrix.b).toBe(0)
  expect(newState.domMatrix.c).toBe(0)
  expect(newState.domMatrix.d).toBe(1.13)
  expect(newState.domMatrix.e).toBe(-1.8199999999999985)
  expect(newState.domMatrix.f).toBe(-1.4299999999999997)
})

test('handleWheel - zoom in at bottom right - should move image to top left', () => {
  const state = {
    ...ViewletEditorImage.create(),
    top: 0,
    left: 0,
    width: 100,
    height: 100,
  }
  const newState = ViewletEditorImage.handleWheel(state, 100, 100, 0, -26)
  expect(newState.domMatrix.a).toBe(1.13)
  expect(newState.domMatrix.b).toBe(0)
  expect(newState.domMatrix.c).toBe(0)
  expect(newState.domMatrix.d).toBe(1.13)
  expect(newState.domMatrix.e).toBe(-12.999999999999986)
  expect(newState.domMatrix.f).toBe(-12.999999999999986)
})

test('handleWheel - zoom into the middle', () => {
  const state = {
    ...ViewletEditorImage.create(),
    top: 0,
    left: 0,
    width: 100,
    height: 100,
  }
  const newState = ViewletEditorImage.handleWheel(state, 50, 50, 0, -26)
  expect(newState.domMatrix.a).toBe(1.13)
  expect(newState.domMatrix.b).toBe(0)
  expect(newState.domMatrix.c).toBe(0)
  expect(newState.domMatrix.d).toBe(1.13)
  expect(newState.domMatrix.e).toBe(-6.499999999999993)
  expect(newState.domMatrix.f).toBe(-6.499999999999993)
})

test.skip('handleWheel - zoom out', () => {
  const state = { ...ViewletEditorImage.create(), top: 0, left: 0 }
  const newState = ViewletEditorImage.handleWheel(state, 0, 0, 0, 13)
  expect(newState.zoom).toBe(0.9389671361502347)
  expect(newState.domMatrix.a).toBe(0.9389671361502347)
  expect(newState.domMatrix.b).toBe(0)
  expect(newState.domMatrix.c).toBe(0)
  expect(newState.domMatrix.d).toBe(0.9389671361502347)
  expect(newState.domMatrix.e).toBe(0)
  expect(newState.domMatrix.f).toBe(0)
})

test('copyImage', () => {
  const state = {
    ...ViewletEditorImage.create(),
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    src: '/test/file.png',
  }
  const newState = ViewletEditorImage.handleWheel(state, 50, 50, 0, -26)
  expect(newState.domMatrix.a).toBe(1.13)
  expect(newState.domMatrix.b).toBe(0)
  expect(newState.domMatrix.c).toBe(0)
  expect(newState.domMatrix.d).toBe(1.13)
  expect(newState.domMatrix.e).toBe(-6.499999999999993)
  expect(newState.domMatrix.f).toBe(-6.499999999999993)
})

test('handlePointerUp', () => {
  const state = {
    ...ViewletEditorImage.create(),
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    eventCache: [
      {
        pointerId: 5,
        x: 210.5,
        y: 165.5,
      },
    ],
  }
  const newState = ViewletEditorImage.handlePointerUp(state, 5, 0, 0)
  expect(newState.eventCache).toEqual([])
})
