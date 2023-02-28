const { CommandNotFoundError } = require('../CommandNotFoundError/CommandNotFoundError.js')
const ModuleMap = require('../ModuleMap/ModuleMap.js')

const state = {
  commands: Object.create(null),
  pendingModules: Object.create(null),
  async load(moduleId) {},
}

const initializeModule = (module) => {
  if (module.Commands) {
    for (const [key, value] of Object.entries(module.Commands)) {
      if (module.name) {
        const actualKey = `${module.name}.${key}`
        register(actualKey, value)
      } else {
        register(key, value)
      }
    }
    return
  }
  throw new Error(`module ${module.name} is missing commands`)
}

const getOrLoadModule = (moduleId) => {
  if (!state.pendingModules[moduleId]) {
    const importPromise = state.load(moduleId)
    state.pendingModules[moduleId] = importPromise.then(initializeModule)
  }
  return state.pendingModules[moduleId]
}

const loadCommand = (command) => getOrLoadModule(ModuleMap.getModuleId(command))

const register = (commandId, listener) => {
  state.commands[commandId] = listener
}

const hasThrown = new Set()

const loadThenExecute = async (command, ...args) => {
  await loadCommand(command)
  // TODO can skip then block in prod (only to prevent endless loop in dev)
  if (!(command in state.commands)) {
    if (hasThrown.has(command)) {
      return
    }
    hasThrown.add(command)
    throw new Error(`Command did not register "${command}"`)
  }
  return execute(command, ...args)
}

const execute = (command, ...args) => {
  if (command in state.commands) {
    return state.commands[command](...args)
  }
  return loadThenExecute(command, ...args)
}

exports.execute = execute

exports.invoke = async (command, ...args) => {
  if (!(command in state.commands)) {
    await loadCommand(command)
    if (!(command in state.commands)) {
      throw new CommandNotFoundError(command)
    }
  }
  return state.commands[command](...args)
}

exports.setLoad = (load) => {
  state.load = load
}
