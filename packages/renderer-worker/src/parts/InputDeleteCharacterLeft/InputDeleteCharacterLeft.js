export const deleteCharacterLeft = (value, cursorOffset) => {
  if (value === '') {
    return {
      newValue: value,
      newCursorOffset: cursorOffset,
    }
  }
  const newValue = value.slice(0, -1)
  const newCursorOffset = newValue.length
  return {
    newValue,
    newCursorOffset,
  }
}
