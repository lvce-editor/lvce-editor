const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.captureId === newState.captureId
  },
  apply(oldState, newState) {
    return ['setScreenCapture', newState.captureId]
  },
}

export const hasFunctionalRender = true

export const render = [renderMessage]
