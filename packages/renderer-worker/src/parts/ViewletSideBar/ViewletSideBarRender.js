export const hasFunctionalRender = true

const renderTitle = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    return [/* method */ 'setTitle', /* name */ newState.currentViewletId]
  },
}

export const render = [renderTitle]
