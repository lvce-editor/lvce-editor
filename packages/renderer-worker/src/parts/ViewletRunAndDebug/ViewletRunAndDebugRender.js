import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DebugScopeChainType from '../DebugScopeChainType/DebugScopeChainType.js'
import * as DebugState from '../DebugState/DebugState.js'
import * as DebugValueType from '../DebugValueType/DebugValueType.js'
import * as DiffDom from '../DiffDom/DiffDom.js'
import * as ViewletRunAndDebugStrings from '../ViewletRunAndDebug/ViewletRunAndDebugStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const DebugButton = ClassNames.IconButton + ' ' + ClassNames.DebugButton

/**
 * @enum {string}
 */
const Roles = {
  TreeItem: 'treeitem',
  None: 'none',
}

const buttonResume = {
  type: VirtualDomElements.Button,
  className: DebugButton,
  title: ViewletRunAndDebugStrings.resume(),
  childCount: 1,
}

const iconContinue = {
  type: VirtualDomElements.Div,
  className: `MaskIcon MaskIconDebugContinue`,
  childCount: 0,
}

const buttonPause = {
  type: VirtualDomElements.Button,
  className: DebugButton,
  title: ViewletRunAndDebugStrings.pause(),
  childCount: 1,
}

const iconPause = {
  type: VirtualDomElements.Div,
  className: 'MaskIcon MaskIconDebugPause',
  childCount: 0,
}

const buttonStepOver = {
  type: VirtualDomElements.Button,
  className: DebugButton,
  title: ViewletRunAndDebugStrings.stepOver(),
  childCont: 1,
}

const iconStepOver = {
  type: VirtualDomElements.Div,
  className: 'MaskIcon MaskIconDebugStepOver',
  childCount: 0,
}

const buttonStepInto = {
  type: VirtualDomElements.Button,
  className: DebugButton,
  title: ViewletRunAndDebugStrings.stepInto(),
  childCount: 1,
}

const iconStepInto = {
  type: VirtualDomElements.Div,
  className: 'MaskIcon MaskIconDebugStepInto',
  childCount: 0,
}

const buttonStepOut = {
  type: VirtualDomElements.Button,
  className: DebugButton,
  title: ViewletRunAndDebugStrings.stepOut(),
  childCount: 1,
}

const iconStepOut = {
  type: VirtualDomElements.Div,
  className: 'MaskIcon MaskIconDebugStepOut',
  childCount: 0,
}

const buttons = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugButtons,
  childCount: 4,
}

const renderButtons = (state) => {
  const { debugState } = state
  const elements = []
  elements.push(buttons)
  if (debugState === DebugState.Paused) {
    elements.push(buttonResume, iconContinue)
  } else {
    elements.push(buttonPause, iconPause)
  }
  elements.push(buttonStepOver, iconStepOver, buttonStepInto, iconStepInto, buttonStepOut, iconStepOut)
  return elements
}

const watchHeader = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugSectionHeader,
  tabIndex: 0,
  childCount: 2,
}
const iconTriangleRight = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugMaskIcon,
  maskImage: 'TriangleRight',
  childCount: 0,
}

const iconTriangleDown = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugMaskIcon,
  maskImage: 'TriangleDown',
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
const debugRow3 = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugRow,
  childCount: 3,
}

const renderBreakPoints = (state) => {
  return [breakPointsHeader, iconTriangleRight, textBreakPoints]
}

const getDebugValueClassName = (valueType) => {
  switch (valueType) {
    case DebugValueType.Undefined:
      return ClassNames.DebugValueUndefined
    case DebugValueType.Number:
      return ClassNames.DebugValueNumber
    default:
      return ''
  }
}

const scopeHeader = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugSectionHeader,
  role: Roles.TreeItem,
  ariaLevel: 1,
  ariaExpanded: false,
  tabIndex: 0,
  childCount: 2,
}
const scopeHeaderExpanded = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugSectionHeader,
  role: Roles.TreeItem,
  ariaLevel: 1,
  ariaExpanded: true,
  childCount: 2,
}
const textScope = text(ViewletRunAndDebugStrings.scope())
const separator = text(': ')
const debugPropertyKey = {
  type: VirtualDomElements.Span,
  className: ClassNames.DebugPropertyKey,
  childCount: 1,
}

const debugPausedMessage = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugPausedMessage,
  childCount: 1,
}
const textNotPaused = text(ViewletRunAndDebugStrings.notPaused())

const renderScope = (state) => {
  const { scopeChain, scopeExpanded } = state
  const elements = []
  if (scopeExpanded) {
    elements.push(scopeHeaderExpanded, iconTriangleDown, textScope)
    if (scopeChain.length === 0) {
      elements.push(debugPausedMessage, textNotPaused)
    } else {
      for (const scope of scopeChain) {
        switch (scope.type) {
          case DebugScopeChainType.This:
            elements.push(
              {
                type: VirtualDomElements.Div,
                className: ClassNames.DebugRow,
                paddingLeft: scope.indent,
                childCount: 3,
              },
              {
                type: VirtualDomElements.Span,
                childCount: 1,
              },
              text(scope.key),
              separator,
              {
                type: VirtualDomElements.Span,
                childCount: 1,
              },
              text(scope.value),
            )
            break
          case DebugScopeChainType.Exception:
            elements.push(
              debugRow3,
              {
                type: VirtualDomElements.Span,
                childCount: 1,
              },
              text(scope.key),
              separator,

              {
                type: VirtualDomElements.Span,
                childCount: 1,
              },
              text(scope.value),
            )
            break
          case DebugScopeChainType.Scope:
            elements.push(
              debugRow1,
              {
                type: VirtualDomElements.Span,
                childCount: 1,
              },
              text(scope.key),
            )
            break
          case DebugScopeChainType.Property:
            const className = getDebugValueClassName(scope.valueType)
            elements.push(
              {
                type: VirtualDomElements.Div,
                className: ClassNames.DebugRow,
                paddingLeft: scope.indent,
                childCount: 3,
              },
              debugPropertyKey,
              text(scope.key),
              separator,
              {
                type: VirtualDomElements.Span,
                className,
                childCount: 1,
              },
              text(scope.value),
            )
            break
        }
        // elements.push(div({ className: ClassNames.DebugRow }, 1), text(scope.key))
      }
    }
  } else {
    elements.push(scopeHeader, iconTriangleRight, textScope)
  }
  return elements
}

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

const getVirtualDom = (state) => {
  const elements = []
  elements.push(...renderButtons(state))
  elements.push(...renderWatch(state))
  elements.push(...renderBreakPoints(state))
  elements.push(...renderScope(state))
  elements.push(...renderCallStack(state))
  return elements
}

let first = true

const renderDebug = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    const oldDom = getVirtualDom(oldState)
    const newDom = getVirtualDom(newState)
    // console.log({ oldDom, newDom })
    const diff = DiffDom.diffDom(oldDom, newDom)
    // console.log({ diff })
    // if (first) {
    //   first = false
    console.log({ newDom })
    return ['setDom', newDom]
    // }
    // return ['setPatches', diff]
  },
}

export const render = [renderDebug]
