export const closeTabsLeft = (state) => {
  const { focusedIndex, editors } = state
  const newEditors = editors.slice(focusedIndex)
  return {
    ...state,
    activeIndex: 0,
    focusedIndex: 0,
    editors: newEditors,
  }
}
