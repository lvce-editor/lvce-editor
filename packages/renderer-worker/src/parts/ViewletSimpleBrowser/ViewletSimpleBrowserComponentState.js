import { getComponentDom } from './ViewletSimpleBrowserRender.js'

export { getComponentDom }

export const getComponentState = (state) => ({ ...state, loginChallenges: [] })

export const setComponentState = (currentState, state) => {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new TypeError('SimpleBrowser state must be an object')
  }
  if (state.uid !== currentState.uid) {
    throw new Error(`SimpleBrowser state uid must remain ${currentState.uid}`)
  }
  const nextState = { ...state, loginChallenges: Array.isArray(state.loginChallenges) ? state.loginChallenges : [] }
  if (state.inputValue !== currentState.inputValue) {
    return { ...nextState, addressValueVersion: (currentState.addressValueVersion || 0) + 1 }
  }
  return nextState
}
