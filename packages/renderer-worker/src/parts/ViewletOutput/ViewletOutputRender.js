import * as RenderMethod from '../RenderMethod/RenderMethod.js'

const renderText = {
  isEqual(oldState, newState) {
    return oldState.text === newState.text
  },
  apply(oldState, newState) {
    return [RenderMethod.SetText, newState.text]
  },
}

export const hasFunctionalRender = true

export const render = [renderText]
