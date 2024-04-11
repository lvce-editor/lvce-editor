import * as GetExtensionDetailVirtualDom from '../GetExtensionDetailVirtualDom/GetExtensionDetailVirtualDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderDom = {
  isEqual(oldState, newState) {
    return (
      oldState.name === newState.name &&
      oldState.description === newState.description &&
      oldState.iconSrc === newState.iconSrc &&
      oldState.sanitizedReadmeHtml === newState.sanitizedReadmeHtml
    )
  },
  apply(oldState, newState) {
    const dom = GetExtensionDetailVirtualDom.getExtensionDetailVirtualDom(newState, newState.sanitizedReadmeHtml)
    return ['Viewlet.setDom2', dom]
  },
}

const renderSize = {
  isEqual(oldState, newState) {
    return oldState.size === newState.size
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetSize, /* oldSize */ oldState.size, /* newSize */ newState.size]
  },
}

export const render = [renderDom, renderSize]
