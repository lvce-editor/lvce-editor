export const hasFunctionalRender = true

const renderTitle = {
  isEqual(oldState, newState) {
    return oldState.title === newState.title
  },
  apply(oldState, newState) {
    return ['setTitle', newState.title]
  },
}

export const render = [renderTitle]
