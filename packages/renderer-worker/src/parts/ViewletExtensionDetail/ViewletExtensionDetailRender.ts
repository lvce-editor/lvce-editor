import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as ExtensionDetailViewWorker from '../ExtensionDetailViewWorker/ExtensionDetailViewWorker.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

const renderDom = {
  isEqual(oldState, newState) {
    return oldState.dom === newState.dom
  },
  apply(oldState, newState) {
    const dom = newState.dom
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

export const renderEventListeners = async () => {
  const listeners = await ExtensionDetailViewWorker.invoke('ExtensionDetail.renderEventListeners')
  return listeners
}
