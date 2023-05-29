const Assert = require('../Assert/Assert.js')

const state = (exports.state = {
  all: Object.create(null),
})

exports.add = (pid, name) => {
  Assert.number(pid)
  Assert.string(name)
  state.all[pid] = name
}

exports.remove = (pid) => {
  Assert.number(pid)
  delete state.all[pid]
}

exports.getAll = () => {
  return Object.entries(state.all)
}
