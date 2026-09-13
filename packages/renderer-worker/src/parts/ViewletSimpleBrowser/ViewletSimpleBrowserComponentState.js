export const getComponentState = (state) => state

export const setComponentState = (currentState, state) => {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new TypeError('SimpleBrowser state must be an object')
  }
  if (state.uid !== currentState.uid) {
    throw new Error(`SimpleBrowser state uid must remain ${currentState.uid}`)
  }
  if (state.inputValue !== currentState.inputValue) {
    return { ...state, addressValueVersion: (currentState.addressValueVersion || 0) + 1 }
  }
  return state
}
