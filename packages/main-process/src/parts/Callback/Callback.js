import * as Assert from '../Assert/Assert.js'
import * as Id from '../Id/Id.js'
import * as Promises from '../Promises/Promises.js'

export const state = {
  callbacks: Object.create(null),
}

export const registerPromise = () => {
  const id = Id.create()
  const { resolve, reject, promise } = Promises.withResolvers()
  state.callbacks[id] = {
    resolve,
    reject,
  }
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
