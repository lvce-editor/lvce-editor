export const handleListFocus = (state) => {
  return {
    ...state,
    listFocused: true,
    listFocusedIndex: -1,
  }
}
