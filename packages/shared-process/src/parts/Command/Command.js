import * as ModuleMap from '../ModuleMap/ModuleMap.js'

export const state = {
  commands: Object.create(null),
  invocables: Object.create(null),
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
    state.pendingModules[moduleId] = importPromise
      .then(initializeModule)
      .catch((error) => {
        console.error(error)
      })
  }
  return state.pendingModules[moduleId]
}

const loadCommand = (command) => getOrLoadModule(ModuleMap.getModuleId(command))

export const register = (commandId, listener) => {
  state.commands[commandId] = listener
}

export const registerInvocable = (commandId, listener) => {
  state.invocables[commandId] = listener
}

export const invoke = async (command, ...args) => {
  if (!(command in state.commands)) {
    await loadCommand(command)
    if (!(command in state.commands)) {
      console.warn(`[shared process] Unknown command "${command}"`)
      throw new Error(`Command ${command} not found`)
    }
  }
  if (typeof state.commands[command] !== 'function') {
    throw new TypeError(`Command ${command} is not a function`)
  }
  return state.commands[command](...args)
}

export const execute = (command, ...args) => {
  if (command in state.commands) {
    state.commands[command](...args)
  } else {
    loadCommand(command)
      // TODO can skip then block in prod (only to prevent endless loop in dev)
      .then(() => {
        if (!(command in state.commands)) {
          console.warn(`Unknown command "${command}"`)
          return
        }
        try {
          execute(command, ...args)
        } catch (error) {
          console.error('[shared process] command failed to execute')
          console.error(error)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

export const setLoad = (load) => {
  state.load = load
}
