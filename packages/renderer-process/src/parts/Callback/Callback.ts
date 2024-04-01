import * as Assert from '../Assert/Assert.ts'
import * as Id from '../Id/Id.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Promises from '../Promises/Promises.ts'

export const state = {
  callbacks: Object.create(null),
}

export const registerPromise = () => {
  const id = Id.create()
  const { resolve, promise } = Promises.withResolvers()
  state.callbacks[id] = resolve
  return { id, promise }
}

export const resolve = (id, args) => {
  Assert.number(id)
  if (!(id in state.callbacks)) {
    console.log(args)
    Logger.warn(`callback ${id} may already be disposed`)
    return
  }
  state.callbacks[id](args)
  delete state.callbacks[id]
}
