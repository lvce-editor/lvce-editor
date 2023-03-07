import * as IsEmptyString from '../IsEmptyString/IsEmptyString.js'

export const deleteCharacterLeft = (value, cursorOffset) => {
  if (IsEmptyString.isEmptyString(value)) {
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
