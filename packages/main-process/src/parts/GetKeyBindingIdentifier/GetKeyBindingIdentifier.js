import * as KeyModifier from '../KeyModifier/KeyModifier.js'
import * as GetKeyCode from '../GetKeyCode/GetKeyCode.js'
import * as NormalizeKey from '../NormalizeKey/NormalizeKey.js'

export const getKeyBindingIdentifier = (input) => {
  const { control, shift, alt, meta, key } = input
  const modifierControl = control ? KeyModifier.CtrlCmd : 0
  const modifierShift = shift ? KeyModifier.Shift : 0
  const modifierAlt = alt ? KeyModifier.Alt : 0
  const normalizedKey = NormalizeKey.normalizeKey(key)
  const keyCode = GetKeyCode.getKeyCode(normalizedKey)
  const identifier = modifierControl | modifierShift | modifierAlt | keyCode
  return identifier
}
