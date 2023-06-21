const state = {
  /**
   * @type {any[]}
   */
  windowStates: [],
}

const findById = (id) => {
  for (const windowState of state.windowStates) {
    if (windowState.id === id) {
      return windowState
    }
  }
  return undefined
}

const findIndexById = (id) => {
  for (let i = 0; i < state.windowStates.length; i++) {
    const windowState = state.windowStates[i]
    if (windowState.id === id) {
      return i
    }
  }
  return -1
}

const remove = (id) => {
  const index = this.findIndexById(id)
  if (index === -1) {
    throw new Error(`expected window ${id} to be in windows array`)
  }
  state.windowStates.splice(index, 1)
}

const getAll = () => {
  return state.windowStates
}

const add = (config) => {
  state.windowStates.push(config)
}

exports.state = state
exports.findById = findById
exports.findIndexById = findIndexById
exports.remove = remove
exports.getAll = getAll
exports.add = add
