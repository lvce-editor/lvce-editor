export const hasFunctionalRender = true

const renderTerminal = {
  isEqual(oldState, newState) {
    return oldState.uid === newState.uid
  },
  apply(oldState, newState) {
    return ['setTerminal', newState.uid]
  },
}

export const render = [renderTerminal]
