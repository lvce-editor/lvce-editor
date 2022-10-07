import * as Module from '../Module/Module.js'
import * as ModuleMap from '../ModuleMap/ModuleMap.js'

export const state = {
  commands: Object.create(null),
  pendingModules: Object.create(null),
}

const initializeModule = (module) => {
  if (typeof module.__initialize__ !== 'function') {
    if (module.Commands) {
      for (const [key, value] of Object.entries(module.Commands)) {
        register(key, value)
      }
      return
    }
    throw new Error(
      `module ${module.name} is missing an initialize function and commands`
    )
  }
  return module.__initialize__()
}

const getOrLoadModule = (moduleId) => {
  if (!state.pendingModules[moduleId]) {
    const importPromise = Module.load(moduleId)
    state.pendingModules[moduleId] = importPromise.then(initializeModule)
  }
  return state.pendingModules[moduleId]
}

const loadCommand = (command) => getOrLoadModule(ModuleMap.getModuleId(command))

export const register = (commandId, listener) => {
  state.commands[commandId] = listener
}

export const registerMultitpe = (commands) => {
  Object.assign(state.commands, commands)
}

const hasThrown = new Set()

export const execute = (command, ...args) => {
  if (command in state.commands) {
    if (typeof state.commands[command] !== 'function') {
      throw new Error(`[renderer-worker] Command ${command} is not a function`)
    }
    return state.commands[command](...args)
  }
  return (
    loadCommand(command)
      // TODO can skip then block in prod (only to prevent endless loop in dev)
      .then(() => {
        if (!(command in state.commands)) {
          if (hasThrown.has(command)) {
            return
          }
          hasThrown.add(command)
          throw new Error(`Command did not register "${command}"`)
        }
        return execute(command, ...args)
      })
  )
}
