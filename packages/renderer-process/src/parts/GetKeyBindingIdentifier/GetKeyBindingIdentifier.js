import * as GetKeyCode from '../GetKeyCode/GetKeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'

const normalizeKey = (key) => {
  if (key.length === 1) {
    return key.toLowerCase()
  }
  return key
}

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
  identifier |= GetKeyCode.getKeyCode(normalizeKey(event.key))
  return identifier
}
