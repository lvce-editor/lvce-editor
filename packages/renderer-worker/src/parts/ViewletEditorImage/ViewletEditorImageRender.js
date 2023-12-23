import * as DomMatrix from '../DomMatrix/DomMatrix.js'
import * as GetImageVirtualDom from '../GetImageVirtualDom/GetImageVirtualDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderImage = {
  isEqual(oldState, newState) {
    return oldState.src === newState.src && oldState.errorMessage === newState.errorMessage
  },
  apply(oldState, newState) {
    const dom = GetImageVirtualDom.getImageVirtualDom(newState.src, newState.errorMessage)
    return ['setDom', dom]
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

export const render = [renderImage, renderTransform, renderCursor]
