import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderItems = {
  isEqual(oldState, newState) {
    return oldState.statusBarItemsLeft === newState.statusBarItemsLeft && oldState.statusBarItemsRight === newState.statusBarItemsRight
  },
  apply(oldState, newState) {
    return [
      /* method */ RenderMethod.SetItems,
      /* statusBarItemsLeft */ newState.statusBarItemsLeft,
      /* statusBarItemsRight */ newState.statusBarItemsRight,
    ]
  },
}

export const render = [renderItems]
