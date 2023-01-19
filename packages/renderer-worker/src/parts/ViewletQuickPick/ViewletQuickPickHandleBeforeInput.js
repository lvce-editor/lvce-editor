import * as InputEventType from '../InputEventType/InputEventType.js'

const handleBeforeInputInsertText = (state, data) => {
  return {
    ...state,
    value: state.value + data,
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
