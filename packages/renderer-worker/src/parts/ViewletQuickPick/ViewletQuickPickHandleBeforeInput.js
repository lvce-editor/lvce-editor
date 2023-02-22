import * as Assert from '../Assert/Assert.js'
import * as BeforeInput from '../BeforeInput/BeforeInput.js'
import * as ViewletQuickPickHandleInput from './ViewletQuickPickHandleInput.js'

export const handleBeforeInput = (state, inputType, data, selectionStart, selectionEnd) => {
  Assert.string(inputType)
  Assert.number(selectionStart)
  Assert.number(selectionEnd)
  const { value } = state
  const { newValue, cursorOffset } = BeforeInput.getNewValue(value, inputType, data, selectionStart, selectionEnd)
  return ViewletQuickPickHandleInput.handleInput(state, newValue, cursorOffset)
}
