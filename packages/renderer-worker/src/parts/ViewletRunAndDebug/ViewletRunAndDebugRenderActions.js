import * as GetRunAndDebugButtonsVirtualDom from '../GetRunAndDebugButtonsVirtualDom/GetRunAndDebugButtonsVirtualDom.js'

export const renderActions = {
  isEqual(oldState, newState) {
    return false // TODO
  },
  apply(oldState, newState) {
    const dom = GetRunAndDebugButtonsVirtualDom.getRunAndDebugButtonsVirtualDom(newState.debugState)
    return dom
  },
}
