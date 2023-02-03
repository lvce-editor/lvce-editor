import * as BeforeInput from '../BeforeInput/BeforeInput.js'
import * as ViewletKeyBindingsHandleInput from './ViewletKeyBindingsHandleInput.js'

export const handleBeforeInput = (state, inputType, data) => {
  const { value, selectionStart, selectionEnd } = state
  const { newValue, cursorOffset } = BeforeInput.getNewValue(value, inputType, data, selectionStart, selectionEnd)
  return {
    ...ViewletKeyBindingsHandleInput.handleInput(state, newValue),
    selectionStart: cursorOffset,
    selectionEnd: cursorOffset,
  }
}
