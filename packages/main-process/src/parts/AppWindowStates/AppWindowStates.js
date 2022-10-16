exports.state = {
  /**
   * @type {any[]}
   */
  windows: [],
}

exports.findById = (id) => {
  for (const window of this.state.windows) {
    if (window.id === id) {
      return window
    }
  }
  return undefined
}

exports.remove = (id) => {
  const index = exports.state.windows.findIndex((window) => window.id === id)
  if (index === -1) {
    throw new Error('expected window to be in windows array')
  }
  exports.state.windows.splice(index, 1)
}

exports.add = (config) => {
  exports.state.windows.push(config)
}
