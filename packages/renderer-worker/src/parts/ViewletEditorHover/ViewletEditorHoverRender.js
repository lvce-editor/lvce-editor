export const hasFunctionalRender = true

const renderHover = {
  isEqual(oldState, newState) {
    return (
      oldState.displayString === newState.displayString &&
      oldState.documentation === newState.minLineY &&
      oldState.maxLineY === newState.documentation
    )
  },
  apply(oldState, newState) {
    return [/* method */ 'setHover', newState.displayString, newState.documentation]
  },
}

export const render = [renderHover]
