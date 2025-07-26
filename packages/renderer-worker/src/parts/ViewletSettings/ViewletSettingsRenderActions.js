export const renderActions = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    const dom = newState.actionsDom
    return dom
  },
}
