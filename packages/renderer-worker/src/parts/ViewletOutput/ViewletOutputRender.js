import * as GetOutputActionsVirtualDom from '../GetOutputActionsVirtualDom/GetOutputActionsVirtualDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

const renderText = {
  isEqual(oldState, newState) {
    return oldState.text === newState.text
  },
  apply(oldState, newState) {
    return [RenderMethod.SetText, newState.text]
  },
}

export const renderActions = {
  isEqual(oldState, newState) {
    return oldState === newState
  },
  apply(oldState, newState) {
    const dom = GetOutputActionsVirtualDom.getOutputActionsVirtualDom()
    return dom
  },
}

export const hasFunctionalRender = true

export const render = [renderText]
