export const hasFunctionalRender = true

const renderFocus = {
  isEqual(oldState, newState) {
    return oldState.isFocused === newState.isFocused
  },
  apply(oldState, newState) {
    return ['setFocused', newState.isFocused]
  },
}

export const render = [renderFocus]
