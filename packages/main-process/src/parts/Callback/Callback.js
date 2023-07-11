import * as Assert from '../Assert/Assert.cjs'
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

export const resolve = (id, args) => {
  Assert.number(id)
  const { callbacks } = state
  if (!(id in callbacks)) {
    console.log(args)
    console.warn(`callback ${id} may already be disposed`)
    return
  }
  callbacks[id].resolve(args)
  delete callbacks[id]
}
