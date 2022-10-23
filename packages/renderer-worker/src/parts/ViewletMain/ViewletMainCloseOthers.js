export const closeOthers = (state) => {
  const { focusedIndex, editors } = state
  const newEditors = [editors[focusedIndex]]
  return {
    ...state,
    focusedIndex: 0,
    activeIndex: 0,
    editors: newEditors,
  }
}
