import * as ExtensionHostState from '../ExtensionHost/ExtensionHostState.js'

export const getSavedWebViewState = async (id) => {
  const states = await ExtensionHostState.getSavedState()
  if (!states) {
    return undefined
  }
  if (!Array.isArray(states)) {
    return undefined
  }
  for (const item of states) {
    if (item && item.key && item.key === id && item.value && item.value.state) {
      return item.value.state
    }
  }
  console.log({ states, id })
  return undefined
}
