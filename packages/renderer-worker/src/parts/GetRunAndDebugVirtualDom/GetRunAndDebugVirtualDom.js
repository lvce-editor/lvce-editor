import * as GetRunAndDebugBreakPointsVirtualDom from '../GetRunAndDebugBreakPointsVirtualDom/GetRunAndDebugBreakPointsVirtualDom.js'
import * as GetRunAndDebugCallStackVirtualDom from '../GetRunAndDebugCallStackVirtualDom/GetRunAndDebugCallStackVirtualDom.js'
import * as GetRunAndDebugScopeVirtualDom from '../GetRunAndDebugScopeVirtualDom/GetRunAndDebugScopeVirtualDom.js'
import * as GetRunAndDebugWatchVirtualDom from '../GetRunAndDebugWatchVirtualDom/GetRunAndDebugWatchVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getRunAndDebugVirtualDom = (state) => {
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: 'Viewlet RunAndDebug',
    tabIndex: 0,
    childCount: 4,
  })
  dom.push(...GetRunAndDebugWatchVirtualDom.renderWatch(state))
  dom.push(...GetRunAndDebugBreakPointsVirtualDom.renderBreakPoints(state))
  dom.push(...GetRunAndDebugScopeVirtualDom.getRunAndDebugScopeVirtualDom(state))
  dom.push(...GetRunAndDebugCallStackVirtualDom.getRunAndDebugCallStackVirtualDom(state))
  return dom
}
