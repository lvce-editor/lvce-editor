import * as Assert from '../Assert/Assert.js'
import * as Clamp from '../Clamp/Clamp.js'
import * as Command from '../Command/Command.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const name = ViewletModuleId.EditorImage

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
    pointerDownCount: 0,
  }
}

const getSrcRemote = (uri) => {
  const src = `/remote${uri}`
  return src
}

const getSrcWithBlobUrl = async (uri) => {
  const content = await FileSystem.readFile(uri)
  const mimeType = await Command.execute('Mime.getMediaMimeType', uri)
  const blob = await Command.execute(
    'Blob.binaryStringToBlob',
    content,
    mimeType
  )
  const dataUrl = await Command.execute('Url.createObjectUrl', blob)
  return dataUrl
}

const canUseRemoteLoading = (uri) => {
  const protocol = FileSystem.getProtocol(uri)
  return protocol === ''
}

const getSrc = (uri) => {
  if (canUseRemoteLoading(uri)) {
    return getSrcRemote(uri)
  }
  return getSrcWithBlobUrl(uri)
}

// TODO revoke object url when disposed
export const loadContent = async (state, savedState) => {
  console.log({ savedState })
  const { uri } = state
  const src = await getSrc(uri)
  return {
    ...state,
    src,
  }
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
  const { eventCache, pointerDownCount } = state
  const newEventCache = [...eventCache, { pointerId, x, y }]
  const newPointerDownCount = pointerDownCount + 1
  return {
    ...state,
    pointerOffsetX: x,
    pointerOffsetY: y,
    eventCache: newEventCache,
    pointerDownCount: newPointerDownCount,
  }
}

const distance = (point1, point2) => {
  const dx = point1.x - point2.x
  const dy = point1.y - point2.y
  return Math.hypot(dx + dy)
}

const handleZoom = (state) => {
  const { domMatrix, eventCache, previousDiff, touchZoomFactor } = state
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
}

const handleMove = (state, x, y) => {
  const { pointerOffsetX, pointerOffsetY, domMatrix } = state
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

export const handlePointerMove = (state, pointerId, x, y) => {
  Assert.object(state)
  Assert.number(x)
  Assert.number(y)
  const { eventCache, pointerDownCount } = state
  if (pointerDownCount === 0) {
    return state
  }
  const index = eventCache.findIndex((event) => event.pointerId === pointerId)
  // TODO avoid mutation
  eventCache[index] = { pointerId, x, y }
  if (eventCache.length === 2) {
    return handleZoom(state)
  }
  return handleMove(state, x, y)
}

const removePointer = (eventCache, pointerId) => {
  const index = eventCache.findIndex((event) => event.pointerId === pointerId)
  const newEventCache = [
    ...eventCache.slice(0, index),
    ...eventCache.slice(index + 1),
  ]
  return newEventCache
}

export const handlePointerUp = (state, pointerId, x, y) => {
  const { eventCache, pointerDownCount } = state
  if (pointerDownCount === 0) {
    return state
  }
  const newEventCache = removePointer(eventCache, pointerId)
  const newPointerDownCount = pointerDownCount - 1
  return {
    ...state,
    eventCache: newEventCache,
    pointerDownCount: newPointerDownCount,
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

const renderCursor = {
  isEqual(oldState, newState) {
    return oldState.eventCache.length === newState.eventCache.length
  },
  apply(oldState, newState) {
    const isDragging = newState.eventCache.length > 0
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'EditorImage',
      /* method */ 'setDragging',
      /* isDragging */ isDragging,
    ]
  },
}

export const render = [renderSrc, renderTransform, renderCursor]
