import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'

export const hasFunctionalRender = true

// export const hasFunctionalRootRender = true

export const renderDialog = {
  isEqual(oldState, newState) {
    return false
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderDialog]
