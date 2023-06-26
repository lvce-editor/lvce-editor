const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return ['setMessage', newState.message]
  },
}

const renderBounds = {
  isEqual(oldState, newState) {
    return oldState.x === newState.x && oldState.y === newState.y && oldState.width === newState.width
  },
  apply(oldState, newState) {
    return ['setBounds', newState.x, newState.y, newState.width, newState.height]
  },
}

export const render = [renderMessage, renderBounds]
