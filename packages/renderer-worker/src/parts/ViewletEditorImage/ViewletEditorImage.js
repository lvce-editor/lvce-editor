import * as Assert from '../Assert/Assert.js'
import * as Clamp from '../Clamp/Clamp.js'

export const name = 'EditorImage'

export const create = (id, uri, left, top, width, height) => {
  return {
    src: '',
    disposed: false,
    top,
    left,
    width,
    height,
    uri,
    domMatrix: new DOMMatrixReadOnly(),
    pointerOffsetX: 0,
    pointerOffsetY: 0,
    minZoom: 0.1,
    maxZoom: 2 ** 15, // max value that doesn't result in degradation
    zoomFactor: 200,
  }
}

export const loadContent = async (state, ...args) => {
  return {
    ...state,
    src: state.uri,
  }
}

export const contentLoaded = async (state) => {}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const handlePointerDown = (state, x, y) => {
  Assert.object(state)
  Assert.number(x)
  Assert.number(y)
  return {
    ...state,
    pointerOffsetX: x,
    pointerOffsetY: y,
  }
}

export const handlePointerMove = (state, x, y) => {
  Assert.object(state)
  Assert.number(x)
  Assert.number(y)
  const { pointerOffsetX, pointerOffsetY, domMatrix } = state
  const deltaX = x - pointerOffsetX
  const deltaY = y - pointerOffsetY
  const newDomMatrix = domMatrix.translate(deltaX, deltaY)
  return {
    ...state,
    pointerOffsetX: x,
    pointerOffsetY: y,
    domMatrix: newDomMatrix,
  }
}

const getNewZoom = (zoom, zoomFactor, minZoom, maxZoom, deltaY) => {
  const direction = deltaY < 0 ? 'up' : 'down'
  const normalizedDeltaY = 1 + Math.abs(deltaY) / zoomFactor
  const currentZoomFactor =
    direction === 'up' ? normalizedDeltaY : 1 / normalizedDeltaY
  const newZoom = zoom * currentZoomFactor
  return Clamp.clamp(newZoom, minZoom, maxZoom)
}

export const handleWheel = (state, x, y, deltaX, deltaY) => {
  if (deltaY === 0) {
    return state
  }
  const { top, left } = state
  const relativeX = x - left
  const relativeY = y - top
  const { domMatrix, zoomFactor, minZoom, maxZoom } = state
  const zoom = domMatrix.a
  const newZoom = getNewZoom(zoom, zoomFactor, minZoom, maxZoom, deltaY)
  const newDomMatrix = new DOMMatrix()
    .translateSelf(relativeX, relativeY)
    .scaleSelf(newZoom)
    .translateSelf(-relativeX, -relativeY)
    .multiplySelf(domMatrix)
  console.log({
    x,
    y,
    deltaX,
    deltaY,
    newA: newDomMatrix.a,
    newZoom,
    oldZoom: zoom,
    oldA: domMatrix.a,
  })

  return {
    ...state,
    domMatrix: newDomMatrix,
  }
}

export const hasFunctionalRender = true

const renderSrc = {
  isEqual(oldState, newState) {
    return oldState.src === newState.src
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'EditorImage',
      /* method */ 'setSrc',
      /* src */ `/remote${newState.src}`,
    ]
  },
}

// workaround for browser bug
const stringifyDomMatrix = (domMatrix) => {
  const { a, b, c, d, e, f } = domMatrix
  return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`
}

const renderTransform = {
  isEqual(oldState, newState) {
    return oldState.domMatrix === newState.domMatrix
  },
  apply(oldState, newState) {
    const transform = stringifyDomMatrix(newState.domMatrix)
    console.log({ transform })
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'EditorImage',
      /* method */ 'setTransform',
      /* transform */ transform,
    ]
  },
}

export const render = [renderSrc, renderTransform]
