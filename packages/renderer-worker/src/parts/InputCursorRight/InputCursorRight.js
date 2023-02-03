export const cursorRight = (value, cursorOffset) => {
  if (cursorOffset === value.length) {
    return {
      newValue: value,
      newCursorOffset: cursorOffset,
    }
  }
  const newCursorOffset = cursorOffset + 1
  return {
    newValue: value,
    cursorOffset: newCursorOffset,
  }
}
