export const closeTabsRight = (state) => {
  const { focusedIndex, editors } = state
  const newEditors = editors.slice(0, focusedIndex + 1)
  return {
    ...state,
    editors: newEditors,
  }
}
