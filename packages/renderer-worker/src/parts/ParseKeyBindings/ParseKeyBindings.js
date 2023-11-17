import * as Assert from '../Assert/Assert.js'
import * as GetKeyCodeString from '../GetKeyCodeString/GetKeyCodeString.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'

const parseKey = (rawKey) => {
  Assert.number(rawKey)
  const isCtrl = Boolean(rawKey & KeyModifier.CtrlCmd)
  const isShift = Boolean(rawKey & KeyModifier.Shift)
  const keyCode = rawKey & 0x0000ffff
  const key = GetKeyCodeString.getKeyCodeString(keyCode)
  return {
    key,
    isCtrl,
    isShift,
  }
}

const parseKeyBinding = (keyBinding) => {
  return {
    ...keyBinding,
    rawKey: keyBinding.key,
    ...parseKey(keyBinding.key),
  }
}

export const parseKeyBindings = (keyBindings) => {
  return keyBindings.map(parseKeyBinding)
}
