export const renderTitle = {
  isEqual(oldState, newState) {
    return oldState === newState
  },
  apply(oldState, newState) {
    const prefix = `Extensions`
    const postfix = `Installed`
    const title = `${prefix}: ${postfix}`
    return title
  },
}
