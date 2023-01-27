import * as DebugScopeChainType from '../DebugScopeChainType/DebugScopeChainType.js'
import * as DebugState from '../DebugState/DebugState.js'
import * as DebugValueType from '../DebugValueType/DebugValueType.js'
import * as DiffDom from '../DiffDom/DiffDom.js'
import * as Icon from '../Icon/Icon.js'
import { button, div, span, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'
/**
 * @enum {string}
 */
const ClassNames = {
  IconButton: 'IconButton DebugButton',
  MaskIcon: 'MaskIcon',
  DebugSectionHeader: 'DebugSectionHeader',
  DebugPausedMessage: 'DebugPausedMessage',
  DebugRow: 'DebugRow',
  DebugPropertyKey: 'DebugPropertyKey',
  DebugValueUndefined: 'DebugValueUndefined',
  DebugValueNumber: 'DebugValueNumber',
  DebugPropertyValue: 'DebugPropertyValue',
  DebugMaskIcon: 'MaskIcon DebugMaskIcon',
  DebugButtons: 'DebugButtons',
}

/**
 * @enum {string}
 */
const UiStrings = {
  StepInto: 'Step Into',
  StepOver: 'Step Over',
  StepOut: 'Step Out',
  Pause: 'Pause',
  Watch: 'Watch',
  BreakPoints: 'BreakPoints',
  Scope: 'Scope',
  CallStack: 'Call Stack',
  NotPaused: 'Not Paused',
  Resume: 'Resume',
}

/**
 * @enum {string}
 */
const Roles = {
  TreeItem: 'treeitem',
  None: 'none',
}

const buttonResume = button(
  {
    className: ClassNames.IconButton,
    title: UiStrings.Resume,
  },
  1
)

const iconContinue = div(
  {
    className: ClassNames.MaskIcon,
    maskImage: Icon.DebugContinue,
  },
  0
)

const buttonPause = button(
  {
    className: ClassNames.IconButton,
    title: UiStrings.Pause,
  },
  1
)

const iconPause = div(
  {
    className: ClassNames.MaskIcon,
    maskImage: Icon.DebugPause,
  },
  0
)

const buttonStepOver = button(
  {
    className: ClassNames.IconButton,
    title: UiStrings.StepOver,
  },
  1
)

const iconStepOver = div(
  {
    className: ClassNames.MaskIcon,
    maskImage: Icon.DebugStepOver,
  },
  0
)

const buttonStepInto = button(
  {
    className: ClassNames.IconButton,
    title: UiStrings.StepInto,
  },
  1
)

const iconStepInto = div(
  {
    className: ClassNames.MaskIcon,
    maskImage: Icon.DebugStepInto,
  },
  0
)

const buttonStepOut = button(
  {
    className: ClassNames.IconButton,
    title: UiStrings.StepOut,
  },
  1
)

const iconStepOut = div(
  {
    className: ClassNames.MaskIcon,
    maskImage: Icon.DebugStepOut,
  },
  0
)

const buttons = div(
  {
    className: ClassNames.DebugButtons,
  },
  4
)

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

const watchHeader = div({ className: ClassNames.DebugSectionHeader, tabIndex: 0 }, 2)
const iconTriangleRight = div(
  {
    className: ClassNames.DebugMaskIcon,
    maskImage: Icon.TriangleRight,
  },
  0
)
const iconTriangleDown = div(
  {
    className: ClassNames.DebugMaskIcon,
    maskImage: Icon.TriangleDown,
  },
  0
)

const textWatch = text(UiStrings.Watch)

const renderWatch = (state) => {
  return [watchHeader, iconTriangleRight, textWatch]
}

const breakPointsHeader = div({ className: ClassNames.DebugSectionHeader, tabIndex: 0 }, 2)

const textBreakPoints = text(UiStrings.BreakPoints)

const debugRow1 = div({ className: ClassNames.DebugRow }, 1)
const debugRow3 = div({ className: ClassNames.DebugRow }, 3)

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

const scopeHeader = div({ className: ClassNames.DebugSectionHeader, role: Roles.TreeItem, ariaLevel: 1, ariaExpanded: false, tabIndex: 0 }, 2)
const scopeHeaderExpanded = div({ className: ClassNames.DebugSectionHeader, role: Roles.TreeItem, ariaLevel: 1, ariaExpanded: true }, 2)
const textScope = text(UiStrings.Scope)
const separator = text(': ')
const debugPropertyKey = span({ className: ClassNames.DebugPropertyKey }, 1)

const debugPausedMessage = div({ className: ClassNames.DebugPausedMessage }, 1)
const textNotPaused = text(UiStrings.NotPaused)

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
              div(
                {
                  className: ClassNames.DebugRow,
                  paddingLeft: scope.indent,
                },
                3
              ),
              span({}, 1),
              text(scope.key),
              separator,
              span({}, 1),
              text(scope.value)
            )
            break
          case DebugScopeChainType.Exception:
            elements.push(debugRow3, span({}, 1), text(scope.key), separator, span({}, 1), text(scope.value))
            break
          case DebugScopeChainType.Scope:
            elements.push(debugRow1, span({}, 1), text(scope.key))
            break
          case DebugScopeChainType.Property:
            const className = getDebugValueClassName(scope.valueType)
            elements.push(
              div(
                {
                  className: ClassNames.DebugRow,
                  paddingLeft: scope.indent,
                },
                3
              ),
              debugPropertyKey,
              text(scope.key),
              separator,
              span({ className }, 1),
              text(scope.value)
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

const headerCallStack = div({ className: ClassNames.DebugSectionHeader, ariaExpanded: false }, 2)
const headerCallStackExpanded = div({ className: ClassNames.DebugSectionHeader, ariaExpanded: true }, 2)
const textCallStack = text(UiStrings.CallStack)

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
    return ['setDom', newDom]
    // }
    // return ['setPatches', diff]
  },
}

export const render = [renderDebug]
