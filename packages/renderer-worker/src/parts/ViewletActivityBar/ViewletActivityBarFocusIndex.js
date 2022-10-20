export const focusIndex = (state, index) => {
  return {
    ...state,
    focusedIndex: index,
    focused: true,
  }
}
