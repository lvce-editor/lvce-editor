import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderTitleBarButtons = {
  isEqual(oldState, newState) {
    return oldState.titleBarButtons === newState.titleBarButtons
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetButtons, /* titleBarEntries */ newState.titleBarButtons]
  },
}

export const render = [renderTitleBarButtons]
