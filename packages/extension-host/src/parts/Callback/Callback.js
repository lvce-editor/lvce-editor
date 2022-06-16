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
export const resolve = (id, result) => {
  if (!(id in state.callbacks)) {
    console.warn(`callback ${id} may already be disposed`)
    return
  }
  state.callbacks[id].resolve(result)
}

export const reject = (id, error) => {
  if (!(id in state.callbacks)) {
    console.warn(`callback ${id} may already be disposed`)
    return
  }
  state.callbacks[id].reject(error)
}
