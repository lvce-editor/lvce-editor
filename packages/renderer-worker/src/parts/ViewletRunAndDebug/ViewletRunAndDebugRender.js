import { button, div, h, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'
import * as Icon from '../Icon/Icon.js'

/**
 * @enum {string}
 */
const ClassNames = {
  IconButton: 'IconButton',
  MaskIcon: 'MaskIcon',
  DebugSectionHeader: 'DebugSectionHeader',
  DebugPausedMessage: 'DebugPausedMessage',
  DebugRow: 'DebugRow',
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

const renderScope = (state) => {
  const { scopeChain } = state
  const elements = [div({ className: ClassNames.DebugSectionHeader }, 1), text(UiStrings.Scope)]
  if (scopeChain.length === 0) {
    elements.push(div({ className: ClassNames.DebugPausedMessage }, 1), text('Not Paused'))
  } else {
    for (const scope of scopeChain) {
      elements.push(div({ className: ClassNames.DebugRow }, 1), text(scope.key))
    }
  }
  return elements
}

const renderCallStack = (state) => {
  const { callStack } = state
  const elements = [div({ className: ClassNames.DebugSectionHeader }, 1), text(UiStrings.CallStack)]
  if (callStack.length === 0) {
    elements.push(div({ className: ClassNames.DebugPausedMessage }, 1), text('Not Paused'))
  } else {
    // TODO
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
