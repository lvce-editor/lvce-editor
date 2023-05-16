import * as Id from '../Id/Id.js'

export const state = {
  callbacks: Object.create(null),
  onceListeners: new Set(),
}

export const registerPromise = () => {
  const id = Id.create()
  const promise = new Promise((resolve, reject) => {
    state.callbacks[id] = { resolve, reject }
  })
  return { id, promise }
}

// TODO merge resolve and resolveEmpty
export const resolve = (id, args) => {
  const { callbacks } = state
  if (!(id in callbacks)) {
    console.warn(`callback ${id} may already be disposed`)
    return
  }
  callbacks[id].resolve(args)
  delete callbacks[id]
}

export const reject = (id, error) => {
  const { callbacks } = state
  if (!(id in callbacks)) {
    console.warn(`callback (rejected) ${id} may already be disposed`)
    return
  }
  callbacks[id].reject(error)
  delete callbacks[id]
}

export const isAllEmpty = () => {
  return Object.keys(state.callbacks).length === 0 && state.onceListeners.size === 0
}
