import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderFocus = {
  isEqual(oldState, newState) {
    return oldState.isFocused === newState.isFocused
  },
  apply(oldState, newState) {
    return [RenderMethod.SetFocused, newState.isFocused]
  },
}

export const render = [renderFocus]
