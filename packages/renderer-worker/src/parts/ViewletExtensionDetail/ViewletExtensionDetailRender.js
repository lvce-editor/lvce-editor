import * as GetExtensionDetailVirtualDom from '../GetExtensionDetailVirtualDom/GetExtensionDetailVirtualDom.js'
import * as GetMarkdownVirtualDom from '../GetMarkdownVirtualDom/GetMarkdownVirtualDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderReadme = {
  isEqual(oldState, newState) {
    return oldState.sanitizedReadmeHtml === newState.sanitizedReadmeHtml
  },
  apply(oldState, newState) {
    const dom = GetMarkdownVirtualDom.getMarkdownVirtualDom(newState.sanitizedReadmeHtml)
    return ['setReadmeDom', dom]
  },
}

const renderHeader = {
  isEqual(oldState, newState) {
    return oldState.name === newState.name && oldState.description === newState.description && oldState.iconSrc === newState.iconSrc
  },
  apply(oldState, newState) {
    const headerDom = GetExtensionDetailVirtualDom.getExtensionDetailVirtualDom(newState)
    return ['setHeaderDom', headerDom]
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

export const render = [renderHeader, renderReadme, renderSize]
