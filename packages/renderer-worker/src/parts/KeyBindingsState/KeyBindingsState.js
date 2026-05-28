import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'
import * as LifeCyclePhase from '../LifeCyclePhase/LifeCyclePhase.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const emptyState = {
  keyBindings: [],
  keyBindingSets: Object.create(null),
  keyBindingIdentifiers: new Uint32Array(),
  matchingKeyBindings: [],
}

const pendingOperations = []

const flushPendingOperations = async () => {
  if (!hasLayoutState()) {
    return
  }
  while (pendingOperations.length > 0) {
    const [command, ...args] = pendingOperations.shift()
    await Command.execute(command, ...args)
  }
}

LifeCycle.once(LifeCyclePhase.Fifteen, flushPendingOperations)

const getLayoutState = () => {
  if (!ViewletStates.hasInstance(ViewletModuleId.Layout)) {
    return emptyState
  }
  return ViewletStates.getState(ViewletModuleId.Layout)
}

const hasLayoutState = () => {
  return ViewletStates.hasInstance(ViewletModuleId.Layout)
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
  if (LifeCycle.state.phase < LifeCyclePhase.Fifteen) {
    pendingOperations.push(['Layout.updateKeyBindings'])
    return
  }
  if (!hasLayoutState()) {
    return
  }
  void Command.execute('Layout.updateKeyBindings')
}

export const addKeyBindings = (id, keyBindings) => {
  Assert.array(keyBindings)
  if (LifeCycle.state.phase < LifeCyclePhase.Fifteen) {
    pendingOperations.push(['Layout.addKeyBindings', id, keyBindings])
    return
  }
  if (!hasLayoutState()) {
    return
  }
  void Command.execute('Layout.addKeyBindings', id, keyBindings)
}

export const removeKeyBindings = (id) => {
  if (LifeCycle.state.phase < LifeCyclePhase.Fifteen) {
    pendingOperations.push(['Layout.removeKeyBindings', id])
    return
  }
  if (!hasLayoutState()) {
    return
  }
  void Command.execute('Layout.removeKeyBindings', id)
}

export const getKeyBindings = () => {
  return getLayoutState().keyBindings
}
