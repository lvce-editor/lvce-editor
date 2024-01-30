import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as ViewletOutputActions from './ViewletOutputActions.js'

const renderText = {
  isEqual(oldState, newState) {
    return oldState === newState
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
    const actions = ViewletOutputActions.getActions(newState)
    const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
    return dom
  },
}

export const hasFunctionalRender = true

export const render = [renderText]
