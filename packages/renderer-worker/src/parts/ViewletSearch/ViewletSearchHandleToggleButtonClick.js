export const handleToggleButtonClick = (state) => {
  const { replaceExpanded } = state
  return {
    ...state,
    replaceExpanded: !replaceExpanded,
  }
}
