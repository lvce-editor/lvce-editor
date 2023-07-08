export const state = {
  commands: Object.create(null),
  async load(moduleId) {},
  pendingModules: Object.create(null),
}

export const registerCommand = (key, fn) => {
  state.commands[key] = fn
}

export const registerCommands = (commandMap) => {
  for (const [key, value] of Object.entries(commandMap)) {
    registerCommand(key, value)
  }
}

export const getCommand = (key) => {
  return state.commands[key]
}

export const setLoad = (fn) => {
  state.load = fn
}

export const load = (moduleId) => {
  return state.load(moduleId)
}

export const hasPendingModule = (moduleId) => {
  return state.pendingModules[moduleId]
}

export const setPendingModule = (moduleId, modulePromise) => {
  state.pendingModules[moduleId] = modulePromise
}

export const getPendingModule = (moduleId) => {
  return state.pendingModules[moduleId]
}
