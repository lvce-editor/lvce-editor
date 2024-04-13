import * as GetRunAndDebugBreakPointsVirtualDom from '../GetRunAndDebugBreakPointsVirtualDom/GetRunAndDebugBreakPointsVirtualDom.js'
import * as GetRunAndDebugCallStackVirtualDom from '../GetRunAndDebugCallStackVirtualDom/GetRunAndDebugCallStackVirtualDom.js'
import * as GetRunAndDebugScopeVirtualDom from '../GetRunAndDebugScopeVirtualDom/GetRunAndDebugScopeVirtualDom.js'
import * as GetRunAndDebugWatchVirtualDom from '../GetRunAndDebugWatchVirtualDom/GetRunAndDebugWatchVirtualDom.js'
import * as GetVirtualDomChildCount from '../GetVirtualDomChildCount/GetVirtualDomChildCount.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getRunAndDebugVirtualDom = (state) => {
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: 'Viewlet RunAndDebug',
    tabIndex: 0,
    childCount: 0,
  })
  const rest = []
  rest.push(...GetRunAndDebugWatchVirtualDom.renderWatch(state))
  rest.push(...GetRunAndDebugBreakPointsVirtualDom.renderBreakPoints(state))
  rest.push(...GetRunAndDebugScopeVirtualDom.getRunAndDebugScopeVirtualDom(state))
  rest.push(...GetRunAndDebugCallStackVirtualDom.getRunAndDebugCallStackVirtualDom(state))
  const childCount = GetVirtualDomChildCount.getVirtualDomChildCount(rest)
  dom[0].childCount = childCount
  dom.push(...rest)
  return dom
}
