import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const emptyState = {
  keyBindings: [],
  keyBindingSets: Object.create(null),
  keyBindingIdentifiers: new Uint32Array(),
  matchingKeyBindings: [],
}

const getLayoutState = () => {
  if (!ViewletStates.hasState(ViewletModuleId.Layout)) {
    return emptyState
  }
  return ViewletStates.getState(ViewletModuleId.Layout)
}

const hasLayoutState = () => {
  return ViewletStates.hasState(ViewletModuleId.Layout)
}

export const state = {
  get keyBindings() {
    return getLayoutState().keyBindings
  },
  get keyBindingSets() {
    return getLayoutState().keyBindingSets
  },
  get keyBindingIdentifiers() {
    return getLayoutState().keyBindingIdentifiers
  },
  get matchingKeyBindings() {
    return getLayoutState().matchingKeyBindings
  },
}

export const getKeyBinding = (identifier) => {
  for (const keyBinding of getLayoutState().matchingKeyBindings) {
    if (keyBinding.key === identifier) {
      return keyBinding
    }
  }
  return undefined
}

export const update = () => {
  if (!hasLayoutState()) {
    return
  }
  void Command.execute('Layout.updateKeyBindings')
}

export const addKeyBindings = (id, keyBindings) => {
  Assert.array(keyBindings)
  if (!hasLayoutState()) {
    return
  }
  void Command.execute('Layout.addKeyBindings', id, keyBindings)
}

export const removeKeyBindings = (id) => {
  if (!hasLayoutState()) {
    return
  }
  void Command.execute('Layout.removeKeyBindings', id)
}

export const getKeyBindings = () => {
  return getLayoutState().keyBindings
}
