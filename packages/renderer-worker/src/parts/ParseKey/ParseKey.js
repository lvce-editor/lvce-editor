import * as Assert from '../Assert/Assert.ts'
import * as GetKeyCodeString from '../GetKeyCodeString/GetKeyCodeString.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'

export const parseKey = (rawKey) => {
  Assert.number(rawKey)
  const isCtrl = Boolean(rawKey & KeyModifier.CtrlCmd)
  const isShift = Boolean(rawKey & KeyModifier.Shift)
  const keyCode = rawKey & 0x000000ff
  const key = GetKeyCodeString.getKeyCodeString(keyCode)
  return {
    key,
    isCtrl,
    isShift,
  }
}
