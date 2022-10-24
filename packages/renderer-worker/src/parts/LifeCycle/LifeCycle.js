import * as LifeCyclePhase from '../LifeCyclePhase/LifeCyclePhase.js'

export const state = {
  listenerMap: Object.create(null),
  phase: LifeCyclePhase.Zero,
}

export const once = (event, listener) => {
  if (state.phase >= event) {
    listener()
  } else {
    // TODO could also statically allocate listenermap at start as array[13]
    state.listenerMap[event] ||= []
    state.listenerMap[event].push(listener)
  }
}

export const mark = (event) => {
  const listeners = state.listenerMap[event] || []
  for (const listener of listeners) {
    listener()
  }
  state.phase = event
  if (event === LifeCyclePhase.Twelve) {
    state.listenerMap = Object.create(null)
  }
}
