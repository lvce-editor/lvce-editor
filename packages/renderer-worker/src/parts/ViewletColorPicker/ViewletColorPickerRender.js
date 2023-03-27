import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderColor = {
  isEqual(oldState, newState) {
    return oldState.color === newState.color
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetColor, /* color */ newState.color]
  },
}

const renderOffsetX = {
  isEqual(oldState, newState) {
    return oldState.offsetX === newState.offsetX
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetOffsetX, /* offsetX */ newState.offsetX]
  },
}

export const render = [renderColor, renderOffsetX]
