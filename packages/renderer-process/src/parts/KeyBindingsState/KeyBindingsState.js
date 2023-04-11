import * as Assert from '../Assert/Assert.js'
import * as Logger from '../Logger/Logger.js'

export const state = {
  keyBindings: [],
  modifier: '',
  modifierTimeout: -1,
  keyBindingSets: Object.create(null),
}

export const addKeyBindings = (id, keyBindings) => {
  Assert.array(keyBindings)
  if (id in state.keyBindingSets) {
    Logger.warn(`cannot add keybindings multiple times: ${id}`)
    return
  }
  state.keyBindingSets[id] = keyBindings
  state.keyBindings.unshift(...keyBindings)
}

export const removeKeyBindings = (id) => {
  Assert.string(id)
  const { keyBindingSets } = state
  if (!(id in keyBindingSets)) {
    Logger.warn(`cannot remove keybindings that are not registered: ${id}`)
    return
  }
  delete keyBindingSets[id]
  state.keyBindings = Object.values(keyBindingSets).flat(1)
}

export const getKeyBindings = () => {
  return state.keyBindings
}

export const isModifier = (modifier) => {
  return state.modifier === modifier
}

export const setModifier = (modifier) => {
  state.modifier = modifier
}

export const setModifierTimeout = (timeout) => {
  state.modifierTimeout = timeout
}

export const hasModifier = () => {
  return state.modifier
}

export const getModifierTimeout = () => {
  return state.modifierTimeout
}
