import * as GetSourceActionsVirtualDom from '../GetSourceActionsVirtualDom/GetSourceActionsVirtualDom.js'

export const hasFunctionalRender = true

const renderSourceActions = {
  isEqual(oldState, newState) {
    return oldState.sourceActions === newState.sourceActions
  },
  apply(oldStatem, newState) {
    const dom = GetSourceActionsVirtualDom.getSourceActionsVirtualDom(newState.sourceActions)
    return ['setDom', dom]
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
