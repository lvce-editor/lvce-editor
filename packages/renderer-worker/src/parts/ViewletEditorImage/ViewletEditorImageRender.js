import * as DomMatrix from '../DomMatrix/DomMatrix.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderSrc = {
  isEqual(oldState, newState) {
    return oldState.src === newState.src
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetSrc, /* src */ newState.src]
  },
}

const renderTransform = {
  isEqual(oldState, newState) {
    return oldState.domMatrix === newState.domMatrix
  },
  apply(oldState, newState) {
    const transform = DomMatrix.toString(newState.domMatrix)
    return [/* method */ RenderMethod.SetTransform, /* transform */ transform]
  },
}

const renderCursor = {
  isEqual(oldState, newState) {
    return oldState.eventCache.length === newState.eventCache.length
  },
  apply(oldState, newState) {
    const isDragging = newState.eventCache.length > 0
    return [/* method */ RenderMethod.SetDragging, /* isDragging */ isDragging]
  },
}
const renderErrorMessage = {
  isEqual(oldState, newState) {
    return oldState.errorMessage === newState.errorMessage
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetError, /* errorMessage */ newState.errorMessage]
  },
}

export const render = [renderSrc, renderTransform, renderCursor, renderErrorMessage]
