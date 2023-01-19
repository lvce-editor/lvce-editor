export const cursorLeft = (state) => {
  const { cursorOffset } = state
  if (cursorOffset === 0) {
    return state
  }
  const newCursorOffset = cursorOffset - 1
  return {
    ...state,
    cursorOffset: newCursorOffset,
  }
}
