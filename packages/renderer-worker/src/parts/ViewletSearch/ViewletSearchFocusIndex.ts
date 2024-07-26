export const focusIndex = (state, index) => {
  return {
    ...state,
    listFocusedIndex: index,
    listFocused: true,
  }
}
