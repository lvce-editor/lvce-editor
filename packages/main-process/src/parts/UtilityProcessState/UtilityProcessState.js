import * as Assert from '../Assert/Assert.js'

export const state = {
  all: Object.create(null),
}

export const add = (pid, process, name) => {
  Assert.number(pid)
  Assert.object(process)
  Assert.string(name)
  state.all[pid] = {
    process,
    name,
  }
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
    if (value.name === name) {
      return value.process
    }
  }
  return undefined
}
