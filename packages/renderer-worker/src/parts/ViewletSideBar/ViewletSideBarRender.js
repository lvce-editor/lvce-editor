import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderTitle = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetTitle, /* name */ newState.title || newState.currentViewletId]
  },
}

export const render = [renderTitle]
