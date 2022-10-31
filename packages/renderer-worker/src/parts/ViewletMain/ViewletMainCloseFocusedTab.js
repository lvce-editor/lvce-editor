export const closeFocusedTab = (state) => {
  const { focusedIndex } = state
  return closeEditor(focusedIndex)
}
