export const closeAllEditors = (state) => {
  return {
    ...state,
    editors: [],
    focusedIndex: -1,
    selectedIndex: -1,
    children: [],
  }
}
