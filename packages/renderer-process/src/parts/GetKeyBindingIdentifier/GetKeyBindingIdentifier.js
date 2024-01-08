import * as GetKeyCode from '../GetKeyCode/GetKeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'
import * as NormalizeKey from '../NormalizeKey/NormalizeKey.js'

export const getKeyBindingIdentifier = (event) => {
  const { ctrlKey, shiftKey, altKey, key } = event
  const modifierControl = ctrlKey ? KeyModifier.CtrlCmd : 0
  const modifierShift = shiftKey ? KeyModifier.Shift : 0
  const modifierAlt = altKey ? KeyModifier.Alt : 0
  const normalizedKey = NormalizeKey.normalizeKey(key)
  const keyCode = GetKeyCode.getKeyCode(normalizedKey)
  const identifier = modifierControl | modifierShift | modifierAlt | keyCode
  return identifier
}
