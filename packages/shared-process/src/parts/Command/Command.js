import * as Module from '../Module/Module.js'
import * as ModuleMap from '../ModuleMap/ModuleMap.js'

const commands = Object.create(null)
const invocables = Object.create(null)
const pendingModules = Object.create(null)

const initializeModule = (module) => {
  if (module.Commands) {
    for (const [key, value] of Object.entries(module.Commands)) {
      register(key, value)
    }
    return
  }
  throw new Error(`module ${module.name} is missing commands`)
}

const getOrLoadModule = (moduleId) => {
  if (!pendingModules[moduleId]) {
    const importPromise = Module.load(moduleId)
    pendingModules[moduleId] = importPromise
      .then(initializeModule)
      .catch((error) => {
        console.error(error)
      })
  }
  return pendingModules[moduleId]
}

const loadCommand = (command) => getOrLoadModule(ModuleMap.getModuleId(command))

export const register = (commandId, listener) => {
  commands[commandId] = listener
}

export const registerInvocable = (commandId, listener) => {
  invocables[commandId] = listener
}

export const invoke = async (command, ...args) => {
  if (!(command in commands)) {
    await loadCommand(command)
    if (!(command in commands)) {
      console.warn(`[shared process] Unknown command "${command}"`)
      throw new Error(`Command ${command} not found`)
    }
  }
  if (typeof commands[command] !== 'function') {
    throw new TypeError(`Command ${command} is not a function`)
  }
  return commands[command](...args)
}

export const execute = (command, ...args) => {
  if (command in commands) {
    commands[command](...args)
  } else {
    loadCommand(command)
      // TODO can skip then block in prod (only to prevent endless loop in dev)
      .then(() => {
        if (!(command in commands)) {
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
