export const cursorRight = (state) => {
  const { cursorOffset, value } = state
  if (cursorOffset === value.length) {
    return state
  }
  const newCursorOffset = cursorOffset + 1
  return {
    ...state,
    cursorOffset: newCursorOffset,
  }
}
