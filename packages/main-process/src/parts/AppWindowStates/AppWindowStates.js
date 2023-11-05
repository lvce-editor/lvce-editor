export const state = {
  /**
   * @type {any[]}
   */
  windowStates: [],
}

export const findByWindowId = (windowId) => {
  const { windowStates } = state
  for (const windowState of windowStates) {
    if (windowState.windowId === windowId) {
      return windowState
    }
  }
  return undefined
}

export const findByWebContentsId = (webContentsId) => {
  const { windowStates } = state
  for (const windowState of windowStates) {
    if (windowState.webContentsId === webContentsId) {
      return windowState
    }
  }
  return undefined
}

export const findIndexById = (id) => {
  const { windowStates } = state
  for (let i = 0; i < windowStates.length; i++) {
    const windowState = windowStates[i]
    if (windowState.windowId === id) {
      return i
    }
  }
  return -1
}

export const remove = (windowId) => {
  const index = findIndexById(windowId)
  if (index === -1) {
    throw new Error(`expected window ${windowId} to be in windows array`)
  }
  state.windowStates.splice(index, 1)
}

export const getAll = () => {
  return state.windowStates
}

export const add = (config) => {
  state.windowStates.push(config)
}

export const findByPort = (port) => {
  for (const config of state.windowStates) {
    if (config.port === port) {
      return config
    }
  }
  return undefined
}
