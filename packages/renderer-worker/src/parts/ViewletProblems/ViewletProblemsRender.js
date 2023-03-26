import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderProblems = {
  isEqual(oldState, newState) {
    return oldState.problems === newState.problems
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetProblems, /* problems */ newState.problems]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetFocusedIndex, /* focusedIndex */ newState.focusedIndex]
  },
}

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetMessage, /* focusedIndex */ newState.message]
  },
}

export const render = [renderProblems, renderFocusedIndex, renderMessage]
