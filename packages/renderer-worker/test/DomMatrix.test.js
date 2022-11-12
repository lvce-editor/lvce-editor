import * as DomMatrix from '../src/parts/DomMatrix/DomMatrix.js'

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

test('create', () => {
  expect(DomMatrix.create()).toBeInstanceOf(DOMMatrix)
})

test('scaleUp', () => {
  const domMatrix = DomMatrix.create([1, 0, 0, 1, 0, 0])
  const newDomMatrix = DomMatrix.scaleUp(domMatrix, 2)
  expect(newDomMatrix).toEqual(new DOMMatrix([2, 0, 0, 2, 0, 0]))
})

test('scaleDown', () => {
  const domMatrix = DomMatrix.create([2, 0, 0, 2, 0, 0])
  const newDomMatrix = DomMatrix.scaleDown(domMatrix, 2)
  expect(newDomMatrix).toEqual(new DOMMatrix([1, 0, 0, 1, 0, 0]))
})

test('zoomInto', () => {
  const domMatrix = DomMatrix.create([1, 0, 0, 1, 0, 0])
  const newDomMatrix = DomMatrix.zoomInto(domMatrix, 1.13, 0, 0)
  expect(newDomMatrix).toEqual(new DOMMatrix([1.13, 0, 0, 1.13, 0, 0]))
})

test('zoomInto - twice', () => {
  const domMatrix = DomMatrix.create([1.13, 0, 0, 1.13, 0, 0])
  const newDomMatrix = DomMatrix.zoomInto(domMatrix, 1.13, 0, 0)
  expect(newDomMatrix).toEqual(
    DomMatrix.create([1.2768999999999997, 0, 0, 1.2768999999999997, 0, 0])
  )
})

test('zoomInto - top left - should move focus to bottom right', () => {
  const domMatrix = DomMatrix.create([1, 0, 0, 1, 0, 0])
  const newDomMatrix = DomMatrix.zoomInto(domMatrix, 1.13, 14, 11)
  expect(newDomMatrix).toEqual(
    DomMatrix.create([
      1.13, 0, 0, 1.13, -1.8199999999999985, -1.4299999999999997,
    ])
  )
})

test('zoomInto - bottom right - should move focus to top left', () => {
  const domMatrix = DomMatrix.create([1, 0, 0, 1, 0, 0])
  const newDomMatrix = DomMatrix.zoomInto(domMatrix, 1.13, 100, 100)
  expect(newDomMatrix).toEqual(
    DomMatrix.create([
      1.13, 0, 0, 1.13, -12.999999999999986, -12.999999999999986,
    ])
  )
})

test('toString', () => {
  const domMatrix = DomMatrix.create([1, 0, 0, 1, 0, 0])
  const domMatruxString = DomMatrix.toString(domMatrix)
  expect(domMatruxString).toBe('matrix(1, 0, 0, 1, 0, 0)')
})

test('move - right', () => {
  const domMatrix = DomMatrix.create([1, 0, 0, 1, 0, 0])
  const newDomMatrix = DomMatrix.move(domMatrix, 10, 0)
  expect(newDomMatrix).toEqual(new DOMMatrix([1, 0, 0, 1, 10, 0]))
})

test('move - left', () => {
  const domMatrix = DomMatrix.create([1, 0, 0, 1, 0, 0])
  const newDomMatrix = DomMatrix.move(domMatrix, -10, 0)
  expect(newDomMatrix).toEqual(new DOMMatrix([1, 0, 0, 1, -10, 0]))
})

test('move - up', () => {
  const domMatrix = DomMatrix.create([1, 0, 0, 1, 0, 0])
  const newDomMatrix = DomMatrix.move(domMatrix, 0, 10)
  expect(newDomMatrix).toEqual(new DOMMatrix([1, 0, 0, 1, 0, 10]))
})

test('move - down', () => {
  const domMatrix = DomMatrix.create([1, 0, 0, 1, 0, 0])
  const newDomMatrix = DomMatrix.move(domMatrix, 0, -10)
  expect(newDomMatrix).toEqual(new DOMMatrix([1, 0, 0, 1, 0, -10]))
})

test('move - with zoom', () => {
  const domMatrix = DomMatrix.create([2, 0, 0, 2, 0, 0])
  const newDomMatrix = DomMatrix.move(domMatrix, 10, 20)
  expect(newDomMatrix).toEqual(new DOMMatrix([2, 0, 0, 2, 10, 20]))
})
