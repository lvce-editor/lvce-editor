export const hasFunctionalRender = true

const renderText = {
  isEqual(oldState, newState) {
    console.log('ren')
    return oldState.text === newState.text
  },
  apply(oldState, newState) {
    return ['setText', newState.text]
  },
}

export const render = [renderText]
