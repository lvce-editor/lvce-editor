const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return ['setMessage', newState.message]
  },
}

export const hasFunctionalRender = true

export const render = [renderMessage]
