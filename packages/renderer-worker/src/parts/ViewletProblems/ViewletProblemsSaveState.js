export const saveState = (state) => {
  const { viewMode, filterValue, collapsedUris } = state
  return {
    viewMode,
    filterValue,
    collapsedUris,
  }
}
