import * as GetEditorErrorVirtualDom from '../GetEditorErrorVirtualDom/GetEditorErrorVirtualDom.js'

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    const dom = GetEditorErrorVirtualDom.getEditorErrorVirtualDom(newState.message)
    return ['setDom', dom]
  },
}

const renderBounds = {
  isEqual(oldState, newState) {
    return oldState.x === newState.x && oldState.y === newState.y && oldState.width === newState.width
  },
  apply(oldState, newState) {
    return ['setBounds', newState.x, newState.y, newState.width, newState.height]
  },
}

export const render = [renderMessage, renderBounds]
