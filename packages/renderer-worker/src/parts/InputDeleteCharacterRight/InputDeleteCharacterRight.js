export const deleteCharacterRight = (value, cursorOffset) => {
  if (cursorOffset === value.length) {
    return {
      newValue: value,
      newCursorOffset: cursorOffset,
    }
  }
  const newValue = value.slice(0, cursorOffset) + value.slice(cursorOffset + 1)
  return {
    newValue,
    newCursorOffset: cursorOffset,
  }
}
