export const saveState = (state) => {
  const { viewMode, filterValue } = state
  return {
    viewMode,
    filterValue,
  }
}
