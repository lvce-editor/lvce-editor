import * as GetKeyCode from '../GetKeyCode/GetKeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'

export const getKeyBindingIdentifier = (event) => {
  let identifier = 0
  if (event.ctrlKey) {
    identifier |= KeyModifier.CtrlCmd
  }
  if (event.shiftKey) {
    identifier |= KeyModifier.Shift
  }
  if (event.altKey) {
    identifier |= KeyModifier.Alt
  }
  identifier |= GetKeyCode.getKeyCode(event.key.toLowerCase())
  return identifier
}
