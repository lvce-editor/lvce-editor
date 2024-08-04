import * as Assert from '../Assert/Assert.ts'
import * as Logger from '../Logger/Logger.js'
import * as Context from '../Context/Context.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const state = {
  keyBindings: [],
  keyBindingSets: Object.create(null),
  /**
   * @type {Uint32Array}
   */
  keyBindingIdentifiers: new Uint32Array(),
  /**
   * @type {any}
   */
  matchingKeyBindings: [],
}

export const getKeyBinding = (identifier) => {
  for (const keyBinding of state.matchingKeyBindings) {
    if (keyBinding.key === identifier) {
      return keyBinding
    }
  }
  return undefined
}

const getKey = (keyBinding) => {
  return keyBinding.key
}

const matchesContext = (keyBinding) => {
  if (!keyBinding.when) {
    return true
  }
  return Context.get(keyBinding.when)
}

const getMatchingKeyBindings = (keyBindingSets) => {
  return Object.values(keyBindingSets).reverse().flat(1).filter(matchesContext)
}

const getAvailableKeyBindings = (keyBindings) => {
  return new Uint32Array(keyBindings.map(getKey))
}

export const update = () => {
  const matchingKeyBindings = getMatchingKeyBindings(state.keyBindingSets)
  const keyBindingIdentifiers = getAvailableKeyBindings(matchingKeyBindings)
  console.log({ matchingKeyBindings })
  RendererProcess.invoke('KeyBindings.setIdentifiers', keyBindingIdentifiers)
  state.matchingKeyBindings = matchingKeyBindings
  state.keyBindingIdentifiers = keyBindingIdentifiers
}

export const addKeyBindings = (id, keyBindings) => {
  Assert.string(id)
  Assert.array(keyBindings)
  if (id in state.keyBindingSets) {
    Logger.warn(`cannot add keybindings multiple times: ${id}`)
    return
  }
  state.keyBindingSets[id] = keyBindings
  update()
}

export const removeKeyBindings = (id) => {
  const { keyBindingSets } = state
  if (!(id in keyBindingSets)) {
    Logger.warn(`cannot remove keybindings that are not registered: ${id}`)
    return
  }
  delete keyBindingSets[id]
  update()
}

export const getKeyBindings = () => {
  return state.keyBindings
}
