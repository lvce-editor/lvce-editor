export const closeTabsRight = (state) => {
  const { focusedIndex, editors } = state
  if (focusedIndex === editors.length - 1) {
    return state
  }
  const newEditors = editors.slice(0, focusedIndex + 1)
  return {
    ...state,
    editors: newEditors,
  }
}
