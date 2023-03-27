export const hasFunctionalRender = true

const renderItems = {
  isEqual(oldState, newState) {
    return oldState.statusBarItemsLeft === newState.statusBarItemsLeft && oldState.statusBarItemsRight === newState.statusBarItemsRight
  },
  apply(oldState, newState) {
    return [/* method */ 'setItems', /* statusBarItemsLeft */ newState.statusBarItemsLeft, /* statusBarItemsRight */ newState.statusBarItemsRight]
  },
}

export const render = [renderItems]
