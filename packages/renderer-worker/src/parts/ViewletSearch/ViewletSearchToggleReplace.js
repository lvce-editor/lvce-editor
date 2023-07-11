export const toggleReplace = (state) => {
  const { replaceExpanded } = state
  return {
    ...state,
    replaceExpanded: !replaceExpanded,
  }
}
