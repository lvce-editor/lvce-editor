export const cursorLeft = (value, cursorOffset) => {
  if (cursorOffset === 0) {
    return {
      newValue: value,
      newCursorOffset: cursorOffset,
    }
  }
  const newCursorOffset = cursorOffset - 1
  return {
    newValue: value,
    newCursorOffset,
  }
}
