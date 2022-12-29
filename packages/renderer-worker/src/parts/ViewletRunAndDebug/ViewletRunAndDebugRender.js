import * as DebugScopeChainType from '../DebugScopeChainType/DebugScopeChainType.js'
import * as DebugValueType from '../DebugValueType/DebugValueType.js'
import * as Icon from '../Icon/Icon.js'
import { button, div, span, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'
import * as DebugState from '../DebugState/DebugState.js'

/**
 * @enum {string}
 */
const ClassNames = {
  IconButton: 'IconButton',
  MaskIcon: 'MaskIcon',
  DebugSectionHeader: 'DebugSectionHeader',
  DebugPausedMessage: 'DebugPausedMessage',
  DebugRow: 'DebugRow',
  DebugPropertyKey: 'DebugPropertyKey',
  DebugValueUndefined: 'DebugValueUndefined',
  DebugValueNumber: 'DebugValueNumber',
  DebugPropertyValue: 'DebugPropertyValue',
  DebugMaskIcon: 'MaskIcon DebugMaskIcon',
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

const renderButtons = (state) => {
  const { debugState } = state

  const elements = []
  if (debugState === DebugState.Paused) {
    elements.push(
      button(
        {
          className: ClassNames.IconButton,
          title: UiStrings.Resume,
        },
        1
      ),
      div(
        {
          className: ClassNames.MaskIcon,
          maskImage: Icon.DebugContinue,
        },
        0
      )
    )
  } else {
    elements.push(
      button(
        {
          className: ClassNames.IconButton,
          title: UiStrings.Pause,
        },
        1
      ),
      div(
        {
          className: ClassNames.MaskIcon,
          maskImage: Icon.DebugPause,
        },
        0
      )
    )
  }
  elements.push(
    button(
      {
        className: ClassNames.IconButton,
        title: UiStrings.StepOver,
      },
      1
    ),
    div(
      {
        className: ClassNames.MaskIcon,
        maskImage: Icon.DebugStepOver,
      },
      0
    ),
    button(
      {
        className: ClassNames.IconButton,
        title: UiStrings.StepInto,
      },
      1
    ),
    div(
      {
        className: ClassNames.MaskIcon,
        maskImage: Icon.DebugStepInto,
      },
      0
    ),
    button(
      {
        className: ClassNames.IconButton,
        title: UiStrings.StepOut,
      },
      1
    ),
    div(
      {
        className: ClassNames.MaskIcon,
        maskImage: Icon.DebugStepOut,
      },
      0
    )
  )
  return elements
}

const renderWatch = (state) => {
  return [
    div({ className: ClassNames.DebugSectionHeader }, 2),
    div(
      {
        className: ClassNames.DebugMaskIcon,
        maskImage: Icon.TriangleRight,
      },
      0
    ),
    text(UiStrings.Watch),
  ]
}

const renderBreakPoints = (state) => {
  return [
    div({ className: ClassNames.DebugSectionHeader }, 2),
    div(
      {
        className: ClassNames.DebugMaskIcon,
        maskImage: Icon.TriangleRight,
      },
      0
    ),
    text(UiStrings.BreakPoints),
  ]
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

const renderScope = (state) => {
  const { scopeChain, scopeExpanded } = state
  const elements = []
  const headerIcon = scopeExpanded ? Icon.TriangleDown : Icon.TriangleRight
  elements.push(
    div({ className: ClassNames.DebugSectionHeader, role: Roles.TreeItem, ariaLevel: 1, ariaExpanded: scopeExpanded }, 2),
    div(
      {
        className: ClassNames.DebugMaskIcon,
        maskImage: headerIcon,
      },
      0
    ),
    text(UiStrings.Scope)
  )
  if (scopeExpanded) {
    if (scopeChain.length === 0) {
      elements.push(div({ className: ClassNames.DebugPausedMessage }, 1), text(UiStrings.NotPaused))
    } else {
      console.log({ scopeChain })
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
              text(': '),
              span({}, 1),
              text(scope.value)
            )
            break
          case DebugScopeChainType.Exception:
            elements.push(div({ className: ClassNames.DebugRow }, 3), span({}, 1), text(scope.key), text(': '), span({}, 1), text(scope.value))
            break
          case DebugScopeChainType.Scope:
            elements.push(div({ className: ClassNames.DebugRow }, 1), span({}, 1), text(scope.key))
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
              span({ className: ClassNames.DebugPropertyKey }, 1),
              text(scope.key),
              text(': '),
              span({ className }, 1),
              text(scope.value)
            )
            break
        }
        // elements.push(div({ className: ClassNames.DebugRow }, 1), text(scope.key))
      }
    }
  }
  return elements
}

const renderCallStack = (state) => {
  const { callStack, callStackExpanded } = state
  const headerIcon = callStackExpanded ? Icon.TriangleDown : Icon.TriangleRight
  const elements = [
    div({ className: ClassNames.DebugSectionHeader }, 2),
    div(
      {
        className: ClassNames.DebugMaskIcon,
        maskImage: headerIcon,
      },
      0
    ),
    text(UiStrings.CallStack),
  ]
  if (callStack.length === 0) {
    elements.push(div({ className: ClassNames.DebugPausedMessage }, 1), text(UiStrings.NotPaused))
  } else {
    for (const item of callStack) {
      elements.push(div({ className: ClassNames.DebugRow }, 1), text(item.functionName))
    }
  }
  return elements
}

const renderDebug = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    const elements = []
    elements.push(...renderButtons(newState))
    elements.push(...renderWatch(newState))
    elements.push(...renderBreakPoints(newState))
    elements.push(...renderScope(newState))
    elements.push(...renderCallStack(newState))
    return ['setDom', elements]
  },
}

export const render = [renderDebug]
