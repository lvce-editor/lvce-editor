export const deleteCharacterLeft = (state) => {
  const { value } = state
  if (value === '') {
    return state
  }
  const newValue = value.slice(0, -1)
  const newCursorOffset = newValue.length
  return {
    ...state,
    value: newValue,
    cursorOffset: newCursorOffset,
  }
}
