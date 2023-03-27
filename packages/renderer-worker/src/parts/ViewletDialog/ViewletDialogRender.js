export const hasFunctionalRender = true

const renderHeader = {
  isEqual(oldState, newState) {
    return oldState.header === newState.header
  },
  apply(oldState, newState) {
    return [/* method */ 'setHeader', newState.header]
  },
}

const renderButtons = {
  isEqual(oldState, newState) {
    return oldState.buttons === newState.buttons
  },
  apply(oldState, newState) {
    return [/* method */ 'setButtons', newState.buttons]
  },
}

const renderCodeFrame = {
  isEqual(oldState, newState) {
    return oldState.codeFrame === newState.codeFrame
  },
  apply(oldState, newState) {
    return [/* method */ 'setCodeFrame', newState.codeFrame]
  },
}

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return [/* method */ 'setErrorMessage', newState.message]
  },
}

const renderStack = {
  isEqual(oldState, newState) {
    return oldState.stack === newState.stack
  },
  apply(oldState, newState) {
    return [/* method */ 'setErrorStack', newState.stack]
  },
}

export const render = [renderHeader, renderButtons, renderCodeFrame, renderMessage, renderStack]
