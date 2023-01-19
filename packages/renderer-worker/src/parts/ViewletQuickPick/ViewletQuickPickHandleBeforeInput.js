import * as InputEventType from '../InputEventType/InputEventType.js'

const handleBeforeInputInsertText = (state, data) => {
  const { value } = state
  const newValue = value + data
  const newCursorOffset = newValue.length
  return {
    ...state,
    value: newValue,
    cursorOffset: newCursorOffset,
  }
}

export const handleBeforeInput = (state, inputType, data) => {
  switch (inputType) {
    case InputEventType.InsertText:
      return handleBeforeInputInsertText(state, data)
    default:
      return state
  }
}
