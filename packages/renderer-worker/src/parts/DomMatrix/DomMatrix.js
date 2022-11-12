export const create = (init = [1, 0, 0, 1, 0, 0]) => {
  return new DOMMatrix(init)
}

export const scaleUp = (domMatrix, deltaScale) => {
  return new DOMMatrix([
    (domMatrix.a *= deltaScale),
    domMatrix.b,
    domMatrix.c,
    (domMatrix.d *= deltaScale),
    domMatrix.e,
    domMatrix.f,
  ])
}

export const scaleDown = (domMatrix, deltaScale) => {
  return scaleUp(domMatrix, 1 / deltaScale)
}

export const zoomInto = (domMatrix, zoomFactor, relativeX, relativeY) => {
  return new DOMMatrix()
    .translateSelf(relativeX, relativeY)
    .scaleSelf(zoomFactor)
    .translateSelf(-relativeX, -relativeY)
    .multiplySelf(domMatrix)
}

// workaround for browser bug
export const toString = (domMatrix) => {
  const { a, b, c, d, e, f } = domMatrix
  return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`
}

export const move = (domMatrix, deltaX, deltaY) => {
  return new DOMMatrix([
    domMatrix.a,
    domMatrix.b,
    domMatrix.c,
    domMatrix.d,
    domMatrix.e + deltaX,
    domMatrix.f + deltaY,
  ])
}
