import * as GetKeyCode from '../GetKeyCode/GetKeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'

const normalizeKey = (key) => {
  if (key.length === 1) {
    return key.toLowerCase()
  }
  return key
}

export const getKeyBindingIdentifier = (event) => {
  const { ctrlKey, shiftKey, altKey, key } = event
  const modifierControl = ctrlKey ? KeyModifier.CtrlCmd : 0
  const modifierShift = shiftKey ? KeyModifier.Shift : 0
  const modifierAlt = altKey ? KeyModifier.Alt : 0
  const keyCode = GetKeyCode.getKeyCode(normalizeKey(key))
  const identifier = modifierControl | modifierShift | modifierAlt | keyCode
  return identifier
}
