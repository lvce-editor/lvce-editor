import * as Assert from '../Assert/Assert.js'
import * as Clamp from '../Clamp/Clamp.js'
import * as Command from '../Command/Command.js'
import * as FileSystem from '../FileSystem/FileSystem.js'

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
    touchZoomFactor: 1000,
    eventCache: [],
    previousDiff: 0,
    pointerDownCount: 0,
  }
}

const loadContentRemote = (state, uri) => {
  const src = `/remote${uri}`
  return {
    ...state,
    src,
  }
}

const loadContentWithBlobUrl = async (state, uri) => {
  const content = await FileSystem.readFile(uri)
  const mimeType = await Command.execute('Mime.getMediaMimeType', uri)
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

const canUseRemoteLoading = (uri) => {
  const protocol = FileSystem.getProtocol(uri)
  return protocol === ''
}

// TODO revoke object url when disposed
export const loadContent = async (state, ...args) => {
  const { uri } = state
  if (canUseRemoteLoading(uri)) {
    return loadContentRemote(state, uri)
  }
  return loadContentWithBlobUrl(state, uri)
}

export const contentLoaded = async (state) => {}

export const dispose = async (state) => {
  const { src } = state
  if (src.startsWith('blob:')) {
    await Command.execute('Url.revokeObjectUrl', src)
  }
  return {
    ...state,
    disposed: true,
  }
}

export const handlePointerDown = (state, pointerId, x, y) => {
  Assert.object(state)
  Assert.number(x)
  Assert.number(y)
  const { eventCache, pointerDownCount, previousDiff } = state
  const newEventCache = [...eventCache, { pointerId, x, y }]
  const newPointerDownCount = pointerDownCount + 1
  const currentDiff = newPointerDownCount===2 ?  distance(newEventCache[0], newEventCache[1]):previousDiff
  return {
    ...state,
    pointerOffsetX: x,
    pointerOffsetY: y,
    eventCache: newEventCache,
    pointerDownCount: newPointerDownCount,
    previousDiff:currentDiff
  }
}

const distance = (point1, point2) => {
  var dx = point1.x - point2.x
  var dy = point1.y - point2.y
  return Math.sqrt(dx * dx + dy * dy)
}

const getPointerEventIndex = (eventCache, pointerId) => {
  // TODO avoid anonymous function
  return eventCache.findIndex((event) => event.pointerId === pointerId)
}

const zoomTo = (
  state,
  currentZoomFactor,
  relativeX,
  relativeY,
  previousDiff
) => {
  if (currentZoomFactor > 1) {
    console.log('zoom in', currentZoomFactor)
  } else if (currentZoomFactor < 1) {
    console.log('zoom out', currentZoomFactor)
  }
  const { domMatrix } = state
  console.log('current zoom', domMatrix.a)
  const newDomMatrix = new DOMMatrix()
    .translateSelf(relativeX, relativeY)
    .scaleSelf(currentZoomFactor)
    .translateSelf(-relativeX, -relativeY)
    .multiplySelf(domMatrix)
  return {
    ...state,
    domMatrix: newDomMatrix,
    previousDiff,
  }
}

const getCurrentZoomFactorPinch = (zoomFactor, delta) => {
  const sign = Math.sign(delta)
  const normalizedDelta = delta / zoomFactor
  const currentZoomFactor = 1 + normalizedDelta
  console.log({normalizedDelta, currentZoomFactor, zoomFactor, delta})
  return currentZoomFactor
}

const getCurrentZoomFactorWheel = (zoomFactor, deltaY) => {
  const sign = Math.sign(deltaY)
  const normalizedDeltaY = deltaY / zoomFactor
  const currentZoomFactor = 1 + sign * normalizedDeltaY
  return currentZoomFactor
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
    pointerDownCount,
    top,
    left,
  } = state
  if (pointerDownCount === 0) {
    return state
  }
  const index = getPointerEventIndex(eventCache, pointerId)
  const newEventCache = [
    ...eventCache.slice(0, index),
    { pointerId, x, y },
    ...eventCache.slice(index + 1),
  ]
  if (eventCache.length === 2) {
    // console.log('two pointers down')
    const currentDiff = distance(newEventCache[0], newEventCache[1])
    const relativeX = (newEventCache[0].x + newEventCache[1].x) / 2 - left
    const relativeY = (newEventCache[0].y + newEventCache[1].y) / 2 - top
    const delta = currentDiff / previousDiff
    console.log({ delta, newEventCache, currentDiff, previousDiff })
    const currentZoomFactor = getCurrentZoomFactorPinch(touchZoomFactor, delta)
    return zoomTo(state, currentZoomFactor, relativeX, relativeY, currentDiff)
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
    previousDiff: 0,
  }
}

export const handlePointerUp = (state, pointerId, x, y) => {
  const { eventCache, pointerDownCount } = state
  const index = getPointerEventIndex(eventCache, pointerId)
  const newEventCache = [
    ...eventCache.slice(0, index),
    ...eventCache.slice(index + 1),
  ]
  const newPointerDownCount = pointerDownCount - 1
  return {
    ...state,
    eventCache: newEventCache,
    pointerDownCount: newPointerDownCount,
    previousDiff: 0,
  }
}

const getNewZoom = (zoom, currentZoomFactor, minZoom, maxZoom) => {
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
  const currentZoomFactor = getCurrentZoomFactorWheel(zoomFactor, deltaY)
  return zoomTo(state, currentZoomFactor, relativeX, relativeY, 0)
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
