import * as Assert from '../Assert/Assert.js'
import * as Clamp from '../Clamp/Clamp.js'
import * as Command from '../Command/Command.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Mime from '../Mime/Mime.js'

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
    domMatrix: new DOMMatrix(),
    pointerOffsetX: 0,
    pointerOffsetY: 0,
    minZoom: 0.1,
    maxZoom: 2 ** 15, // max value that doesn't result in degradation
    zoomFactor: 200,
    touchZoomFactor: 1.015,
    eventCache: [],
    previousDiff: 0,
  }
}

// TODO revoke object url when disposed
export const loadContent = async (state, ...args) => {
  const { uri } = state
  const protocol = FileSystem.getProtocol(uri)
  if (protocol === '') {
    const src = `/remote${uri}`
    return {
      ...state,
      src,
    }
  }
  const content = await FileSystem.readFile(uri)
  const mimeType = Mime.getMimeType(uri)
  const blob = await Command.execute(
    'Blob.binaryStringToBlob',
    content,
    mimeType
  )
  const dataUrl = await Command.execute('Url.createObjectUrl', blob)
  return {
    ...state,
    src: dataUrl,
  }
}

export const contentLoaded = async (state) => {}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const handlePointerDown = (state, pointerId, x, y) => {
  Assert.object(state)
  Assert.number(x)
  Assert.number(y)
  const { eventCache } = state
  const newEventCache = [...eventCache, { pointerId, x, y }]
  return {
    ...state,
    pointerOffsetX: x,
    pointerOffsetY: y,
    eventCache: newEventCache,
  }
}

const distance = (point1, point2) => {
  var dx = point1.x - point2.x
  var dy = point1.y - point2.y
  return Math.sqrt(dx * dx + dy * dy)
}

export const handlePointerMove = (state, pointerId, x, y) => {
  Assert.object(state)
  Assert.number(x)
  Assert.number(y)
  const {
    pointerOffsetX,
    pointerOffsetY,
    domMatrix,
    eventCache,
    previousDiff,
    touchZoomFactor,
  } = state
  const index = eventCache.findIndex((event) => event.pointerId === pointerId)
  // TODO avoid mutation
  eventCache[index] = { pointerId, x, y }

  if (eventCache.length === 2) {
    const currentDiff = distance(eventCache[0], eventCache[1])
    if (previousDiff > 0) {
      if (currentDiff > previousDiff) {
        const newDomMatrix = new DOMMatrix([
          (domMatrix.a *= touchZoomFactor),
          domMatrix.b,
          domMatrix.c,
          (domMatrix.d *= touchZoomFactor),
          domMatrix.e,
          domMatrix.f,
        ])
        return {
          ...state,
          previousDiff: currentDiff,
          domMatrix: newDomMatrix,
        }
      }
      if (currentDiff < previousDiff) {
        const newDomMatrix = new DOMMatrix([
          (domMatrix.a /= touchZoomFactor),
          domMatrix.b,
          domMatrix.c,
          (domMatrix.d /= touchZoomFactor),
          domMatrix.e,
          domMatrix.f,
        ])
        return {
          ...state,
          previousDiff: currentDiff,
          domMatrix: newDomMatrix,
        }
      }
    }
    return {
      ...state,
      previousDiff: currentDiff,
    }
  }
  const deltaX = x - pointerOffsetX
  const deltaY = y - pointerOffsetY
  const newDomMatrix = new DOMMatrix([
    domMatrix.a,
    domMatrix.b,
    domMatrix.c,
    domMatrix.d,
    domMatrix.e + deltaX,
    domMatrix.f + deltaY,
  ])
  return {
    ...state,
    pointerOffsetX: x,
    pointerOffsetY: y,
    domMatrix: newDomMatrix,
  }
}

export const handlePointerUp = (state, pointerId, x, y) => {
  const { eventCache } = state
  const index = eventCache.findIndex((event) => event.pointerId === pointerId)
  const newEventCache = [
    ...eventCache.slice(0, index),
    ...eventCache.slice(index + 1),
  ]
  return {
    ...state,
    eventCache: newEventCache,
  }
}

const getNewZoom = (zoom, currentZoomFactor, minZoom, maxZoom) => {
  const newZoom = zoom * currentZoomFactor
  return Clamp.clamp(newZoom, minZoom, maxZoom)
}

const getCurrentZoomFactor = (zoomFactor, deltaY) => {
  // TODO use enum for direction
  const direction = deltaY < 0 ? 'up' : 'down'
  const normalizedDeltaY = 1 + Math.abs(deltaY) / zoomFactor
  const currentZoomFactor =
    direction === 'up' ? normalizedDeltaY : 1 / normalizedDeltaY
  return currentZoomFactor
}

export const handleWheel = (state, x, y, deltaX, deltaY) => {
  if (deltaY === 0) {
    return state
  }
  const { top, left } = state
  const relativeX = x - left
  const relativeY = y - top
  const { domMatrix, zoomFactor, minZoom, maxZoom } = state
  const currentZoomFactor = getCurrentZoomFactor(zoomFactor, deltaY)
  const newDomMatrix = new DOMMatrix()
    .translateSelf(relativeX, relativeY)
    .scaleSelf(currentZoomFactor)
    .translateSelf(-relativeX, -relativeY)
    .multiplySelf(domMatrix)
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
      /* src */ newState.src,
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
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'EditorImage',
      /* method */ 'setTransform',
      /* transform */ transform,
    ]
  },
}

export const render = [renderSrc, renderTransform]
