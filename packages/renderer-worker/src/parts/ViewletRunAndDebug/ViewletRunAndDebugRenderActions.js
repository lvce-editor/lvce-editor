import * as GetRunAndDebugButtonsVirtualDom from '../GetRunAndDebugButtonsVirtualDom/GetRunAndDebugButtonsVirtualDom.js'

export const renderActions = {
  isEqual(oldState, newState) {
    return oldState.debugState === newState.debugState
  },
  apply(oldState, newState) {
    const dom = GetRunAndDebugButtonsVirtualDom.getRunAndDebugButtonsVirtualDom(newState.debugState)
    return dom
  },
}
