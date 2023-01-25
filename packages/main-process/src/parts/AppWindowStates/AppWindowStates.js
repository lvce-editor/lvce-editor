exports.state = {
  /**
   * @type {any[]}
   */
  windowStates: [],
}

exports.findById = (id) => {
  for (const windowState of this.state.windowStates) {
    if (windowState.id === id) {
      return windowState
    }
  }
  return undefined
}

exports.findIndexById = (id) => {
  for (let i = 0; i < this.state.windowStates.length; i++) {
    const windowState = this.state.windowStates[i]
    if (windowState.id === id) {
      return i
    }
  }
  return -1
}

exports.remove = (id) => {
  const index = this.findIndexById(id)
  if (index === -1) {
    throw new Error(`expected window ${id} to be in windows array`)
  }
  exports.state.windowStates.splice(index, 1)
}

exports.getAll = () => {
  return this.state.windowStates
}

exports.add = (config) => {
  exports.state.windowStates.push(config)
}
