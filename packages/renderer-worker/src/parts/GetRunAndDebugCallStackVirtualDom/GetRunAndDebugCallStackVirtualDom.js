import * as ClassNames from '../ClassNames/ClassNames.js'
import * as ViewletRunAndDebugStrings from '../ViewletRunAndDebug/ViewletRunAndDebugStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.js'

const debugRow1 = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugRow + ' DebugRowCallStack',
  childCount: 1,
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
  onPointerDown: DomEventListenerFunctions.HandleClickSectionCallstack,
}
const headerCallStackExpanded = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugSectionHeader,
  ariaExpanded: true,
  childCount: 2,
  onPointerDown: DomEventListenerFunctions.HandleClickSectionCallstack,
}
const textCallStack = text(ViewletRunAndDebugStrings.callStack())

export const getRunAndDebugCallStackVirtualDom = (state) => {
  const { callStack, callStackExpanded } = state
  const elements = []
  if (callStackExpanded) {
    elements.push(headerCallStackExpanded, GetChevronVirtualDom.getChevronDownVirtualDom(), textCallStack)
    if (callStack.length === 0) {
      elements.push(debugPausedMessage, textNotPaused)
    } else {
      for (const item of callStack) {
        elements.push(debugRow1, text(item.functionName))
      }
    }
  } else {
    elements.push(headerCallStack, GetChevronVirtualDom.getChevronRightVirtualDom(), textCallStack)
  }
  return elements
}
