import * as Arrays from '../Arrays/Arrays.js'
import * as Assert from '../Assert/Assert.js'
import * as BlobSrc from '../BlobSrc/BlobSrc.js'
import * as Clamp from '../Clamp/Clamp.js'
import * as DomMatrix from '../DomMatrix/DomMatrix.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as WheelEvent from '../WheelEvent/WheelEvent.js'

export const create = (id, uri, left, top, width, height) => {
  return {
    src: '',
    disposed: false,
    top,
    left,
    width,
    height,
    uri,
    domMatrix: DomMatrix.create(),
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
export const loadContent = async (state, savedState) => {
  const { uri } = state
  const src = await BlobSrc.getSrc(uri)
  return {
    ...state,
    src,
  }
}

export const dispose = async (state) => {
  const { src } = state
  await BlobSrc.disposeSrc(src)
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
  const dx = point1.x - point2.x
  const dy = point1.y - point2.y
  return Math.hypot(dx + dy)
}

const handleZoom = (state) => {
  const { domMatrix, eventCache, previousDiff, touchZoomFactor } = state
  const currentDiff = distance(eventCache[0], eventCache[1])
  if (previousDiff !== 0) {
    const delta = 1 + Math.abs(previousDiff - currentDiff) / 300
    if (currentDiff > previousDiff) {
      const newDomMatrix = DomMatrix.scaleUp(domMatrix, delta)
      return {
        ...state,
        previousDiff: currentDiff,
        domMatrix: newDomMatrix,
      }
    }
    if (currentDiff < previousDiff) {
      const newDomMatrix = DomMatrix.scaleDown(domMatrix, delta)
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

const handleMove = (state, x, y) => {
  const { pointerOffsetX, pointerOffsetY, domMatrix } = state
  const deltaX = x - pointerOffsetX
  const deltaY = y - pointerOffsetY
  const newDomMatrix = DomMatrix.move(domMatrix, deltaX, deltaY)
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
  const { eventCache } = state
  if (eventCache.length === 0) {
    return state
  }
  const index = Arrays.findObjectIndex(eventCache, 'pointerId', pointerId)
  const newEventCache = Arrays.toSpliced(eventCache, index, 1, {
    pointerId,
    x,
    y,
  })
  const newState = { ...state, eventCache: newEventCache }
  if (newEventCache.length === 2) {
    return handleZoom(newState)
  }
  return handleMove(newState, x, y)
}

const removePointer = (eventCache, pointerId) => {
  const index = Arrays.findObjectIndex(eventCache, 'pointerId', pointerId)
  const newEventCache = Arrays.toSpliced(eventCache, index, 1)
  return newEventCache
}

export const handlePointerUp = (state, pointerId, x, y) => {
  const { eventCache, previousDiff } = state
  if (eventCache.length === 0) {
    return state
  }
  const newEventCache = removePointer(eventCache, pointerId)
  const newPreviousDiff = newEventCache.length === 0 ? 0 : previousDiff
  return {
    ...state,
    eventCache: newEventCache,
    previousDiff: newPreviousDiff,
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
  const normalizedDeltaY = WheelEvent.normalizeDelta(deltaY)
  const { top, left } = state
  const relativeX = x - left
  const relativeY = y - top
  const { domMatrix, zoomFactor, minZoom, maxZoom } = state
  const currentZoomFactor = getCurrentZoomFactor(zoomFactor, normalizedDeltaY)
  const newDomMatrix = DomMatrix.zoomInto(
    domMatrix,
    currentZoomFactor,
    relativeX,
    relativeY
  )
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
    return [/* method */ 'setSrc', /* src */ newState.src]
  },
}

const renderTransform = {
  isEqual(oldState, newState) {
    return oldState.domMatrix === newState.domMatrix
  },
  apply(oldState, newState) {
    const transform = DomMatrix.toString(newState.domMatrix)
    return [/* method */ 'setTransform', /* transform */ transform]
  },
}

const renderCursor = {
  isEqual(oldState, newState) {
    return oldState.eventCache.length === newState.eventCache.length
  },
  apply(oldState, newState) {
    const isDragging = newState.eventCache.length > 0
    return [/* method */ 'setDragging', /* isDragging */ isDragging]
  },
}

export const render = [renderSrc, renderTransform, renderCursor]
