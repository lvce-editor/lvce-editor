export const hasFunctionalRender = true

export const renderSrc = {
  isEqual(oldState, newState) {
    return oldState.src === newState.src
  },
  apply(oldState, newState) {
    return [/* method */ 'setSrc', /* src */ newState.src]
  },
}

const renderAudioErrorMessage = {
  isEqual(oldState, newState) {
    return oldState.audioErrorMessage === newState.audioErrorMessage
  },
  apply(oldState, newState) {
    return [/* method */ 'setAudioErrorMessage', /* src */ newState.audioErrorMessage]
  },
}

export const render = [renderSrc, renderAudioErrorMessage]
