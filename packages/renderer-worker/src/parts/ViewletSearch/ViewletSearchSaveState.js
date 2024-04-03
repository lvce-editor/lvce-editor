export const saveState = (state) => {
  const { value, replaceExpanded } = state
  return {
    value,
    replaceExpanded,
  }
}
