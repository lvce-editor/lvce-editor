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
  if (!(id in state.callbacks)) {
    console.warn(`callback ${id} may already be disposed`)
    return
  }
  state.callbacks[id].resolve(args)
}

export const resolveEmpty = (id) => {
  if (!(id in state.callbacks)) {
    console.warn(`callback (resolved) ${id} may already be disposed`)
    return
  }
  state.callbacks[id].resolve()
}

export const reject = (id, error) => {
  if (!(id in state.callbacks)) {
    console.warn(`callback (rejected) ${id} may already be disposed`)
    return
  }
  state.callbacks[id].reject(error)
}

export const isAllEmpty = () => {
  return (
    Object.keys(state.callbacks).length === 0 && state.onceListeners.size === 0
  )
}
