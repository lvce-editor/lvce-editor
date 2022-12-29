import * as DebugScopeChainType from '../DebugScopeChainType/DebugScopeChainType.js'
import * as DebugValueType from '../DebugValueType/DebugValueType.js'
import * as Icon from '../Icon/Icon.js'
import { button, div, span, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

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
}

const renderButtons = (state) => {
  return [
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
        style: {
          maskImage: `url('${Icon.DebugPause}')`,
          webkitMaskImage: `url('${Icon.DebugPause}')`,
        },
      },
      0
    ),
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
        style: {
          maskImage: `url('${Icon.DebugStepOver}')`,
          webkitMaskImage: `url('${Icon.DebugStepOver}')`,
        },
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
        style: {
          maskImage: `url('${Icon.DebugStepInto}')`,
          webkitMaskImage: `url('${Icon.DebugStepInto}')`,
        },
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
        style: {
          maskImage: `url('${Icon.DebugStepOut}')`,
          webkitMaskImage: `url('${Icon.DebugStepOut}')`,
        },
      },
      0
    ),
  ]
}

const renderWatch = (state) => {
  return [div({ className: ClassNames.DebugSectionHeader }, 1), text(UiStrings.Watch)]
}

const renderBreakPoints = (state) => {
  return [div({ className: ClassNames.DebugSectionHeader }, 1), text(UiStrings.BreakPoints)]
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
  const { scopeChain } = state
  const elements = [div({ className: ClassNames.DebugSectionHeader }, 1), text(UiStrings.Scope)]
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
                style: {
                  paddingLeft: `${scope.indent}px`,
                },
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
                style: {
                  paddingLeft: `${scope.indent}px`,
                },
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
  return elements
}

const renderCallStack = (state) => {
  const { callStack } = state
  const elements = [div({ className: ClassNames.DebugSectionHeader }, 1), text(UiStrings.CallStack)]
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
