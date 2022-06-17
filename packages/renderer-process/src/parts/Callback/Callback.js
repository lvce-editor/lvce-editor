const callbacks = Object.create(null)

export const state = {
  id: 0,
}

export const register = (resolve, reject) => {
  callbacks[++state.id] = { resolve, reject }
  return state.id
}

export const unregister = (id) => {
  delete callbacks[id]
}

export const resolve = (id, result) => {
  if (!(id in callbacks)) {
    console.warn(`callback ${id} may already be disposed`)
    return
  }
  callbacks[id].resolve(result)
}

export const reject = (id, error) => {
  if (!(id in callbacks)) {
    console.warn(`callback ${id} may already be disposed`)
    return
  }
  callbacks[id].reject(error)
}
