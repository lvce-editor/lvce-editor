import * as Assert from '../Assert/Assert.js'
import * as Id from '../Id/Id.js'

export const state = {
  callbacks: Object.create(null),
}

export const registerPromise = () => {
  const id = Id.create()
  const promise = new Promise((resolve, reject) => {
    state.callbacks[id] = {
      resolve,
      reject,
    }
  })
  return { id, promise }
}

export const unregister = (id) => {
  delete state.callbacks[id]
}

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

export const reject = (id, error) => {
  Assert.number(id)
  if (!(id in state.callbacks)) {
    console.warn(`callback ${id} may already be disposed`)
    return
  }
  state.callbacks[id].reject(error)
  delete state.callbacks[id]
}
