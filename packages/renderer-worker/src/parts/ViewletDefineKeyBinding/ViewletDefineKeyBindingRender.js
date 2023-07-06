const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return ['setValue', newState.value]
  },
}

const renderFocus = {
  isEqual(oldState, newState) {
    return oldState.focused === newState.focused
  },
  apply(oldState, newState) {
    return ['focus']
  },
}

export const hasFunctionalRender = true

export const render = [renderValue, renderFocus]
