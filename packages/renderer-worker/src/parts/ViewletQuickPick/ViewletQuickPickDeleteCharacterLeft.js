import * as ViewletQuickPickHandleInput from './ViewletQuickPickHandleInput.js'

export const deleteCharacterLeft = (state) => {
  const { value } = state
  if (value === '') {
    return state
  }
  const newValue = value.slice(0, -1)
  const newCursorOffset = newValue.length
  return ViewletQuickPickHandleInput.handleInput(state, newValue, newCursorOffset)
}
