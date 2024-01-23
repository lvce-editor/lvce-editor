import * as GetDebugConsoleVirtualDom from '../GetDebugConsoleVirtualDom/GetDebugConsoleVirtualDom.js'

export const hasFunctionalRender = true

const renderText = {
  isEqual(oldState, newState) {
    return oldState === newState
  },
  apply(oldState, newState) {
    const dom = GetDebugConsoleVirtualDom.getVirtualDom()
    return ['setDom', dom]
  },
}

export const render = [renderText]
