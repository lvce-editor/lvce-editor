import * as GetSourceActionsVirtualDom from '../GetSourceActionsVirtualDom/GetSourceActionsVirtualDom.js'
import * as GetVisibleSourceActions from '../GetVisibleSourceActions/GetVisibleSourceActions.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderSourceActions = {
  isEqual(oldState, newState) {
    return oldState.sourceActions === newState.sourceActions && oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldStatem, newState) {
    const visible = GetVisibleSourceActions.getVisibleSourceActions(newState.sourceActions, newState.focusedIndex)
    const dom = GetSourceActionsVirtualDom.getSourceActionsVirtualDom(visible)
    return ['Viewlet.setDom2', dom]
  },
}

const renderBounds = {
  isEqual(oldState, newState) {
    return oldState.x === newState.x && oldState.y === newState.y && oldState.width === newState.width && oldState.height === newState.height
  },
  apply(oldState, newState) {
    return ['setBounds', newState.x, newState.y]
  },
}

export const render = [renderSourceActions, renderBounds]
