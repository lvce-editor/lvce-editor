const renderBounds = {
  isEqual(oldState, newState) {
    return oldState.x === newState.x && oldState.y === newState.y
  },
  apply(oldState, newState) {
    return ['setBounds', newState.x, newState.y]
  },
}

export const render = [renderBounds]
