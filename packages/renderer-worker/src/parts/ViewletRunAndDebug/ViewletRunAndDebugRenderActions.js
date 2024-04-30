import * as GetRunAndDebugButtonsVirtualDom from '../GetRunAndDebugButtonsVirtualDom/GetRunAndDebugButtonsVirtualDom.js'

export const renderActions = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    const dom = GetRunAndDebugButtonsVirtualDom.getRunAndDebugButtonsVirtualDom(newState.debugState)
    return dom
  },
}
