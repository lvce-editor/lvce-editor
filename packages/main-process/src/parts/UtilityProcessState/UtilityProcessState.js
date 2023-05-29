const Assert = require('../Assert/Assert.js')

const state = (exports.state = {
  all: Object.create(null),
})

export const add = (pid, name) => {
  Assert.number(pid)
  Assert.string(pid)
  state.all[pid] = name
}

export const remove = (pid) => {
  Assert.number(pid)
  delete state.all[pid]
}

export const getAll = () => {
  return Object.entries(state.all)
}
