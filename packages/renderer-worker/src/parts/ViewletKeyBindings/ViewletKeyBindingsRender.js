import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderKeyBindings = {
  isEqual(oldState, newState) {
    return newState.commands && newState.commands.length === 0
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderKeyBindings]
