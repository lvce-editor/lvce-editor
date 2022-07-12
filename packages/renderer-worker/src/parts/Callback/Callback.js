import * as Assert from '../Assert/Assert.js'

export const state = {
  callbacks: Object.create(null),
  onceListeners: new Set(),
  id: 2,
}

export const register = (resolve, reject) => {
  state.callbacks[++state.id] = {
    resolve,
    reject,
  }
  return state.id
}

export const unregister = (id) => {
  delete state.callbacks[id]
}

// TODO merge resolve and resolveEmpty
export const resolve = (id, args) => {
  Assert.number(id)
  if (!(id in state.callbacks)) {
    console.log(args)
    console.warn(`callback ${id} may already be disposed`)
    return
  }
  state.callbacks[id].resolve(args)
  delete state.callbacks[id]
}

export const resolveEmpty = (id) => {
  if (!(id in state.callbacks)) {
    console.warn(`callback ${id} may already be disposed`)
    return
  }
  state.callbacks[id].resolve()
}

export const reject = (id, error) => {
  Assert.number(id)
  if (!(id in state.callbacks)) {
    console.warn(`callback ${id} may already be disposed`)
    return
  }
  state.callbacks[id].reject(error)
}

export const isAllEmpty = () => {
  return (
    Object.keys(state.callbacks).length === 0 && state.onceListeners.size === 0
  )
}
