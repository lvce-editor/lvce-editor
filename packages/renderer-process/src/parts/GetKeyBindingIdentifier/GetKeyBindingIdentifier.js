import * as GetKeyCode from '../GetKeyCode/GetKeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'

const normalizeKey = (key) => {
  if (key.length === 1) {
    return key.toLowerCase()
  }
  return key
}

export const getKeyBindingIdentifier = (event) => {
  const modifierControl = event.ctrlKey ? KeyModifier.CtrlCmd : 0
  const modifierShift = event.shiftKey ? KeyModifier.Shift : 0
  const modifierAlt = event.altKey ? KeyModifier.Alt : 0
  const keyCode = GetKeyCode.getKeyCode(normalizeKey(event.key))
  const identifier = modifierControl | modifierShift | modifierAlt | keyCode
  return identifier
}
