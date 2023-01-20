import * as InputEventType from '../InputEventType/InputEventType.js'
import * as QuickPickHandleInput from './ViewletQuickPickHandleInput.js'

const handleBeforeInputInsertText = (state, data) => {
  const { value } = state
  const newValue = value + data
  const newCursorOffset = newValue.length
  return QuickPickHandleInput.handleInput(state, newValue, newCursorOffset)
}

export const handleBeforeInput = (state, inputType, data) => {
  switch (inputType) {
    case InputEventType.InsertText:
      return handleBeforeInputInsertText(state, data)
    default:
      return state
  }
}
