import * as ModifierKey from '../ModifierKey/ModifierKey.ts'

export const getModifierKey = (event) => {
  if (event.ctrlKey) {
    return ModifierKey.Ctrl
  }
  if (event.altKey) {
    return ModifierKey.Alt
  }
  return ModifierKey.None
}
