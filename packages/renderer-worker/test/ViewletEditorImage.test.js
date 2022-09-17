/**
 * @jest-environment jsdom
 */
import * as ViewletEditorImage from '../src/parts/ViewletEditorImage/ViewletEditorImage.js'

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
        this.e + deltaX,
        this.f + deltaY,
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
      this.e += deltaX
      this.f += deltaY
      return this
    }

    scaleSelf(scaleX = 1, scaleY = scaleX) {
      console.log({ scaleX, scaleY })
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
  return ViewletManager.render(ViewletEditorImage, oldState, newState)
}

test('name', () => {
  expect(ViewletEditorImage.name).toBe('EditorImage')
})

test('create', () => {
  const state = ViewletEditorImage.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = {
    ...ViewletEditorImage.create(),
    uri: 'test://image.png',
  }
  expect(await ViewletEditorImage.loadContent(state)).toMatchObject({
    src: 'test://image.png',
  })
})

test('dispose', () => {
  const state = ViewletEditorImage.create()
  expect(ViewletEditorImage.dispose(state)).toMatchObject({
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
    ['Viewlet.send', 'EditorImage', 'setSrc', '/remote/test/image.png'],
  ])
})

test('handlePointerMove - move left', () => {
  const state = ViewletEditorImage.create()
  const newState = ViewletEditorImage.handlePointerMove(state, -10, 0)
  expect(newState.domMatrix.e).toBe(-10)
})

test('handlePointerMove - move right', () => {
  const state = ViewletEditorImage.create()
  const newState = ViewletEditorImage.handlePointerMove(state, 10, 0)
  expect(newState.domMatrix.e).toBe(10)
})

test('handlePointerMove - move up', () => {
  const state = ViewletEditorImage.create()
  const newState = ViewletEditorImage.handlePointerMove(state, 0, -10)
  expect(newState.domMatrix.f).toBe(-10)
})

test('handlePointerMove - move down', () => {
  const state = ViewletEditorImage.create()
  const newState = ViewletEditorImage.handlePointerMove(state, 0, 10)
  expect(newState.domMatrix.f).toBe(10)
})

test('handlePointerDown', () => {
  const state = ViewletEditorImage.create()
  const newState = ViewletEditorImage.handlePointerDown(state, 10, 20)
  expect(newState.pointerOffsetX).toBe(10)
  expect(newState.pointerOffsetY).toBe(20)
})

test('handleWheel - no zoom', () => {
  const state = ViewletEditorImage.create()
  const newState = ViewletEditorImage.handleWheel(state, 0, 0, 0, 0)
  expect(newState).toBe(state)
})

test('handleWheel - zoom in', () => {
  const state = ViewletEditorImage.create()
  const newState = ViewletEditorImage.handleWheel(state, 0, 0, 0, -26)
  expect(newState.zoom).toBe(1.13)
  expect(newState.domMatrix.a).toBe(1.13)
  expect(newState.domMatrix.b).toBe(0)
  expect(newState.domMatrix.c).toBe(0)
  expect(newState.domMatrix.d).toBe(1.13)
  expect(newState.domMatrix.e).toBe(0)
  expect(newState.domMatrix.f).toBe(0)
})

test('handleWheel - zoom out', () => {
  const state = ViewletEditorImage.create()
  const newState = ViewletEditorImage.handleWheel(state, 0, 0, 0, 13)
  expect(newState.zoom).toBe(0.9389671361502347)
  expect(newState.domMatrix.a).toBe(0.9389671361502347)
  expect(newState.domMatrix.b).toBe(0)
  expect(newState.domMatrix.c).toBe(0)
  expect(newState.domMatrix.d).toBe(0.9389671361502347)
  expect(newState.domMatrix.e).toBe(0)
  expect(newState.domMatrix.f).toBe(0)
})
