import * as Id from '../Id/Id.js'
import * as Assert from '../Assert/Assert.js'

export const state = Object.create(null)

export const register = (listener) => {
  const id = Id.create()
  state[id] = listener
  return id
}

export const execute = (id, ...args) => {
  Assert.number(id)
  const listener = state[id]
  if (!listener) {
    console.warn(`listener with id ${id} not found`)
    return
  }
  return listener(...args)
}

export const unregister = (id) => {
  delete state[id]
}
