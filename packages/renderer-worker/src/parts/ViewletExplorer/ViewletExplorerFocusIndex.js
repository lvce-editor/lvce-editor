export const focusIndex = (state, index) => {
  if (index < state.minLineY) {
    if (index < 0) {
      return {
        ...state,
        focusedIndex: index,
        focused: true,
      }
    }
    const diff = state.maxLineY - state.minLineY
    return {
      ...state,
      focusedIndex: index,
      focused: true,
      minLineY: index,
      maxLineY: index + diff,
    }
  } else if (index >= state.maxLineY) {
    const diff = state.maxLineY - state.minLineY
    return {
      ...state,
      focusedIndex: index,
      focused: true,
      minLineY: index + 1 - diff,
      maxLineY: index + 1,
    }
  }
  return {
    ...state,
    focusedIndex: index,
    focused: true,
  }
}
