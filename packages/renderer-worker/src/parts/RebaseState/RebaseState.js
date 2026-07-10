export const rebaseState = (oldState, latestState, newState) => {
  if (oldState === latestState) {
    return newState
  }
  const rebasedState = { ...latestState }
  for (const key of Object.keys(newState)) {
    if (!Object.is(oldState[key], newState[key])) {
      rebasedState[key] = newState[key]
    }
  }
  return rebasedState
}
