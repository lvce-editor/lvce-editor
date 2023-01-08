import * as Id from '../Id/Id.js'
import * as Assert from '../Assert/Assert.js'
import * as Logger from '../Logger/Logger.js'

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
    Logger.warn(`listener with id ${id} not found`)
    return
  }
  return listener(...args)
}

export const unregister = (id) => {
  delete state[id]
}
