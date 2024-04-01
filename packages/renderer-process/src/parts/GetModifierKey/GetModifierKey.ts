import * as ModifierKey from '../ModifierKey/ModifierKey.js'

export const getModifierKey = (event) => {
  if (event.ctrlKey) {
    return ModifierKey.Ctrl
  }
  if (event.altKey) {
    return ModifierKey.Alt
  }
  return ModifierKey.None
}
