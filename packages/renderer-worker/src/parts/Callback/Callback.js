import * as Id from '../Id/Id.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Promises from '../Promises/Promises.js'

export const state = {
  callbacks: Object.create(null),
}

export const registerPromise = () => {
  const id = Id.create()
  const { resolve, promise } = Promises.withResolvers()
  state.callbacks[id] = resolve
  return { id, promise }
}

export const resolve = JsonRpc.resolve
