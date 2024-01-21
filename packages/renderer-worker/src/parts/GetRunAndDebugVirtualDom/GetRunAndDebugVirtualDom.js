import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetRunAndDebugButtonsVirtualDom from '../GetRunAndDebugButtonsVirtualDom/GetRunAndDebugButtonsVirtualDom.js'
import * as GetRunAndDebugCallStackVirtualDom from '../GetRunAndDebugCallStackVirtualDom/GetRunAndDebugCallStackVirtualDom.js'
import * as GetRunAndDebugScopeVirtualDom from '../GetRunAndDebugScopeVirtualDom/GetRunAndDebugScopeVirtualDom.js'
import * as ViewletRunAndDebugStrings from '../ViewletRunAndDebug/ViewletRunAndDebugStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const watchHeader = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugSectionHeader,
  tabIndex: 0,
  childCount: 2,
}
const iconTriangleRight = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugMaskIcon + ' MaskIconTriangleRight',
  childCount: 0,
}

const textWatch = text(ViewletRunAndDebugStrings.watch())

const renderWatch = (state) => {
  return [watchHeader, iconTriangleRight, textWatch]
}

const breakPointsHeader = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugSectionHeader,
  tabIndex: 0,
  childCount: 2,
}

const textBreakPoints = text(ViewletRunAndDebugStrings.breakPoints())

const renderBreakPoints = (state) => {
  return [breakPointsHeader, iconTriangleRight, textBreakPoints]
}

export const getRunAndDebugVirtualDom = (state) => {
  const dom = []
  dom.push(...GetRunAndDebugButtonsVirtualDom.getRunAndDebugButtonsVirtualDom(state.debugState))
  dom.push(...renderWatch(state))
  dom.push(...renderBreakPoints(state))
  dom.push(...GetRunAndDebugScopeVirtualDom.getRunAndDebugScopeVirtualDom(state))
  dom.push(...GetRunAndDebugCallStackVirtualDom.getRunAndDebugCallStackVirtualDom(state))
  return dom
}
