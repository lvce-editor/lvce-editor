export const toggleUseRegularExpression = (state) => {
  const { useRegularExpression } = state
  return {
    ...state,
    useRegularExpression: !useRegularExpression,
  }
}
