import * as Assert from '../Assert/Assert.js'
import * as Id from '../Id/Id.js'
import * as Logger from '../Logger/Logger.js'

export const state = {
  callbacks: Object.create(null),
  onceListeners: new Set(),
}

export const register = (resolve, reject) => {
  const id = Id.create()
  state.callbacks[id] = {
    resolve,
    reject,
  }
  return id
}

export const unregister = (id) => {
  delete state.callbacks[id]
}

// TODO merge resolve and resolveEmpty
export const resolve = (id, args) => {
  Assert.number(id)
  if (!(id in state.callbacks)) {
    console.log(args)
    Logger.warn(`callback ${id} may already be disposed`)
    return
  }
  state.callbacks[id].resolve(args)
  delete state.callbacks[id]
}

export const resolveEmpty = (id) => {
  if (!(id in state.callbacks)) {
    Logger.warn(`callback ${id} may already be disposed`)
    return
  }
  state.callbacks[id].resolve()
}

export const reject = (id, error) => {
  Assert.number(id)
  if (!(id in state.callbacks)) {
    Logger.warn(`callback ${id} may already be disposed`)
    return
  }
  state.callbacks[id].reject(error)
  delete state.callbacks[id]
}

export const isAllEmpty = () => {
  return Object.keys(state.callbacks).length === 0 && state.onceListeners.size === 0
}
