import * as Assert from '../Assert/Assert.js'

export const state = {
  all: Object.create(null),
}

export const add = (pid, name) => {
  Assert.number(pid)
  Assert.string(name)
  state.all[pid] = name
}

export const remove = (pid) => {
  Assert.number(pid)
  delete state.all[pid]
}

export const getAll = () => {
  return Object.entries(state.all)
}

export const getByName = (name) => {
  for (const value of Object.values(state.all)) {
    if (value === name) {
      return name
    }
  }
  return undefined
}
