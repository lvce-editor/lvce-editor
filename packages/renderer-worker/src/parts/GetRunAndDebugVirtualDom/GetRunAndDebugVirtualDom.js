import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetRunAndDebugButtonsVirtualDom from '../GetRunAndDebugButtonsVirtualDom/GetRunAndDebugButtonsVirtualDom.js'
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

const iconTriangleDown = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugMaskIcon + ' MaskIconTriangleDown',
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

const debugRow1 = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugRow,
  childCount: 1,
}

const renderBreakPoints = (state) => {
  return [breakPointsHeader, iconTriangleRight, textBreakPoints]
}

const debugPausedMessage = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugPausedMessage,
  childCount: 1,
}
const textNotPaused = text(ViewletRunAndDebugStrings.notPaused())

const headerCallStack = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugSectionHeader,
  ariaExpanded: false,
  childCount: 2,
}
const headerCallStackExpanded = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugSectionHeader,
  ariaExpanded: true,
  childCount: 2,
}
const textCallStack = text(ViewletRunAndDebugStrings.callStack())

const renderCallStack = (state) => {
  const { callStack, callStackExpanded } = state
  const elements = []
  if (callStackExpanded) {
    elements.push(headerCallStackExpanded, iconTriangleDown, textCallStack)
    if (callStack.length === 0) {
      elements.push(debugPausedMessage, textNotPaused)
    } else {
      for (const item of callStack) {
        elements.push(debugRow1, text(item.functionName))
      }
    }
  } else {
    elements.push(headerCallStack, iconTriangleRight, textCallStack)
  }
  return elements
}

export const getRunAndDebugVirtualDom = (state) => {
  const dom = []
  dom.push(...GetRunAndDebugButtonsVirtualDom.getRunAndDebugButtonsVirtualDom(state.debugState))
  dom.push(...renderWatch(state))
  dom.push(...renderBreakPoints(state))
  dom.push(...GetRunAndDebugScopeVirtualDom.getRunAndDebugScopeVirtualDom(state))
  dom.push(...renderCallStack(state))
  return dom
}
