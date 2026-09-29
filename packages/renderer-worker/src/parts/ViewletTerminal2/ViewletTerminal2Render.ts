export const hasFunctionalRender = true

const renderTerminal = {
  isEqual(oldState, newState) {
    return oldState.uid === newState.uid && oldState.xtermMounted === newState.xtermMounted
  },
  apply(oldState, newState) {
    return ['setTerminal', newState.uid]
  },
}

export const render = [renderTerminal]
