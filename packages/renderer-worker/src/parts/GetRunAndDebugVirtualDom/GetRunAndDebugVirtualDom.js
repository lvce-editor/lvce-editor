import * as GetRunAndDebugBreakPointsVirtualDom from '../GetRunAndDebugBreakPointsVirtualDom/GetRunAndDebugBreakPointsVirtualDom.js'
import * as GetRunAndDebugCallStackVirtualDom from '../GetRunAndDebugCallStackVirtualDom/GetRunAndDebugCallStackVirtualDom.js'
import * as GetRunAndDebugScopeVirtualDom from '../GetRunAndDebugScopeVirtualDom/GetRunAndDebugScopeVirtualDom.js'
import * as GetRunAndDebugWatchVirtualDom from '../GetRunAndDebugWatchVirtualDom/GetRunAndDebugWatchVirtualDom.js'

export const getRunAndDebugVirtualDom = (state) => {
  const dom = []
  dom.push(...GetRunAndDebugWatchVirtualDom.renderWatch(state))
  dom.push(...GetRunAndDebugBreakPointsVirtualDom.renderBreakPoints(state))
  dom.push(...GetRunAndDebugScopeVirtualDom.getRunAndDebugScopeVirtualDom(state))
  dom.push(...GetRunAndDebugCallStackVirtualDom.getRunAndDebugCallStackVirtualDom(state))
  return dom
}
