import * as Module from '../Module/Module.js'
import * as ModuleMap from '../ModuleMap/ModuleMap.js'

export const state = {
  commands: Object.create(null),
  pendingModules: Object.create(null),
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
    const importPromise = Module.load(moduleId)
    state.pendingModules[moduleId] = importPromise
      .then(initializeModule)
      .catch((error) => {
        console.error(error)
      })
  }
  return state.pendingModules[moduleId]
}

const loadCommand = async (command) => {
  await getOrLoadModule(ModuleMap.getModuleId(command))
}

export const register = (commandId, listener) => {
  state.commands[commandId] = listener
}

const hasThrown = new Set()

const executeCommandAsync = async (command, ...args) => {
  try {
    await loadCommand(command)
  } catch (error) {
    // @ts-ignore
    throw new Error(`Failed to load command ${command}`, {
      cause: error,
    })
  }
  if (!(command in state.commands)) {
    if (hasThrown.has(command)) {
      return
    }
    hasThrown.add(command)
    throw new Error(`Command did not register "${command}"`)
  }
  return execute(command, ...args)
}

export const execute = (command, ...args) => {
  if (command in state.commands) {
    return state.commands[command](...args)
  }
  return executeCommandAsync(command, ...args)
}
