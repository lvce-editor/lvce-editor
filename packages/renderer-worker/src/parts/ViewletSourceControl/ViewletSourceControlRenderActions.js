export const renderActions = {
  isEqual(oldState, newState) {
    return JSON.stringify(oldState.actionsDom) === JSON.stringify(newState.actionsDom)
  },
  apply(oldState, newState) {
    const dom = newState.actionsDom
    return dom
  },
}
