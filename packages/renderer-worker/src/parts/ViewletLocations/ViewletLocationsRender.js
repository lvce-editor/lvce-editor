import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

const renderItems = {
  isEqual(oldState, newState) {
    return newState.commands.length === 0
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderItems]
