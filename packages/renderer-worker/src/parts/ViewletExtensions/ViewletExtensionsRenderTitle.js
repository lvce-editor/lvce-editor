export const renderTitle = {
  isEqual(oldState, newState) {
    return oldState === newState
  },
  apply(oldState, newState) {
    return 'test title'
  },
}
