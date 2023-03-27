import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

export const renderSrc = {
  isEqual(oldState, newState) {
    return oldState.src === newState.src
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetSrc, /* src */ newState.src]
  },
}

const renderVideoErrorMessage = {
  isEqual(oldState, newState) {
    return oldState.videoErrorMessage === newState.videoErrorMessage
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetVideoErrorMessage, /* src */ newState.videoErrorMessage]
  },
}

export const render = [renderSrc, renderVideoErrorMessage]
