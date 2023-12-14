export const hasFunctionalRender = true

const renderText = {
  isEqual(oldState, newState) {
    return oldState.text === newState.text
  },
  apply(oldState, newState) {
    return ['setText', newState.text]
  },
}

export const render = [renderText]
