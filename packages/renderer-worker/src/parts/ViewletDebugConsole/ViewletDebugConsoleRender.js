import * as GetDebugConsoleVirtualDom from '../GetDebugConsoleVirtualDom/GetDebugConsoleVirtualDom.js'

export const hasFunctionalRender = true

const renderText = {
  isEqual(oldState, newState) {
    return oldState.text === newState.text
  },
  apply(oldState, newState) {
    const dom = GetDebugConsoleVirtualDom.getVirtualDom(newState.text)
    return ['setDom', dom]
  },
}

export const render = [renderText]
