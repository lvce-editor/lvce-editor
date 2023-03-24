export const hasFunctionalRender = true

const renderTitleBarButtons = {
  isEqual(oldState, newState) {
    return oldState.titleBarButtons === newState.titleBarButtons
  },
  apply(oldState, newState) {
    return [/* method */ 'setButtons', /* titleBarEntries */ newState.titleBarButtons]
  },
}

export const render = [renderTitleBarButtons]
