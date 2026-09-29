const sanitizeState = (state) => {
  if (!Object.hasOwn(state, 'authAccessToken')) {
    return state
  }
  const { authAccessToken, ...safeState } = state
  return safeState
}

export const getComponentState = (state) => sanitizeState(state)

export const setComponentState = (currentState, state) => {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new TypeError('Layout state must be an object')
  }
  if (state.uid !== currentState.uid) {
    throw new Error(`Layout state uid must remain ${currentState.uid}`)
  }
  return sanitizeState(state)
}
