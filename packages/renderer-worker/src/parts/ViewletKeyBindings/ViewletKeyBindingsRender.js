export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderKeyBindings = {
  isEqual(oldState, newState) {
    return oldState === newState
  },
  apply(oldState, newState) {
    newState.commands = []
    return newState.commands
  },
  multiple: true,
}

export const render = [renderKeyBindings]
