const state = {
  /**
   * @type {any[]}
   */
  windowStates: [],
}

const findByWindowId = (windowId) => {
  const { windowStates } = state
  for (const windowState of windowStates) {
    if (windowState.windowId === windowId) {
      return windowState
    }
  }
  return undefined
}

const findByWebContentsId = (webContentsId) => {
  const { windowStates } = state
  for (const windowState of windowStates) {
    if (windowState.webContentsId === webContentsId) {
      return windowState
    }
  }
  return undefined
}

const findIndexById = (id) => {
  const { windowStates } = state
  for (let i = 0; i < windowStates.length; i++) {
    const windowState = windowStates[i]
    if (windowState.windowId === id) {
      return i
    }
  }
  return -1
}

const remove = (windowId) => {
  const index = findIndexById(windowId)
  if (index === -1) {
    throw new Error(`expected window ${windowId} to be in windows array`)
  }
  state.windowStates.splice(index, 1)
}

const getAll = () => {
  return state.windowStates
}

const add = (config) => {
  state.windowStates.push(config)
}

const findByPort = (port) => {
  for (const config of state.windowStates) {
    if (config.port === port) {
      return config
    }
  }
  return undefined
}

exports.state = state
exports.findByWindowId = findByWindowId
exports.findByWebContentsId = findByWebContentsId
exports.findIndexById = findIndexById
exports.remove = remove
exports.getAll = getAll
exports.add = add
exports.findByPort = findByPort
