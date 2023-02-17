import * as Logger from '../Logger/Logger.js'
import * as Id from '../Id/Id.js'

const callbacks = Object.create(null)

/**
 * @deprecated use registerPromise instead
 */
export const register = (resolve, reject) => {
  const id = Id.create()
  callbacks[id] = { resolve, reject }
  return id
}

export const registerPromise = () => {
  const id = Id.create()
  const promise = new Promise((resolve, reject) => {
    callbacks[id] = { resolve, reject }
  })
  return { id, promise }
}

export const unregister = (id) => {
  delete callbacks[id]
}

export const resolve = (id, result) => {
  if (!(id in callbacks)) {
    Logger.warn(`callback ${id} may already be disposed`)
    return
  }
  callbacks[id].resolve(result)
}

export const reject = (id, error) => {
  if (!(id in callbacks)) {
    Logger.warn(`callback ${id} may already be disposed`)
    return
  }
  callbacks[id].reject(error)
}
