import * as GetRunAndDebugButtonsVirtualDom from '../GetRunAndDebugButtonsVirtualDom/GetRunAndDebugButtonsVirtualDom.js'

export const getCustomActions = (state) => {
  const dom = []
  dom.push(...GetRunAndDebugButtonsVirtualDom.getRunAndDebugButtonsVirtualDom(state.debugState))
  return dom
}
