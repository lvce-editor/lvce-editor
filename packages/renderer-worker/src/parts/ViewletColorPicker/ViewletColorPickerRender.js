export const hasFunctionalRender = true

const renderColor = {
  isEqual(oldState, newState) {
    return oldState.color === newState.color
  },
  apply(oldState, newState) {
    return [/* method */ 'setColor', /* color */ newState.color]
  },
}

const renderOffsetX = {
  isEqual(oldState, newState) {
    return oldState.offsetX === newState.offsetX
  },
  apply(oldState, newState) {
    return [/* method */ 'setOffsetX', /* offsetX */ newState.offsetX]
  },
}

export const render = [renderColor, renderOffsetX]
