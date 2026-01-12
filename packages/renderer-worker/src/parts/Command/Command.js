import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as ModuleMap from '../ModuleMap/ModuleMap.js'
import { VError } from '../VError/VError.js'

export const state = {
  commands: Object.create(null),
  pendingModules: Object.create(null),
  async load(moduleId) {
    throw new Error('not implemented')
  },
}

const initializeModule = (module) => {
  if (module.Commands) {
    for (const [key, value] of Object.entries(module.Commands)) {
      if (module.name) {
        const actualKey = key.includes('.') ? key : `${module.name}.${key}`
        register(actualKey, value)
      } else {
        register(key, value)
      }
    }
    return
  }
  throw new Error(`module ${module.name} is missing an initialize function and commands`)
}

const loadModule = async (moduleId) => {
  try {
    const module = await state.load(moduleId)
    initializeModule(module)
  } catch (error) {
    throw new VError(error, `failed to load module ${moduleId}`)
  }
}

const getOrLoadModule = (moduleId) => {
  if (!state.pendingModules[moduleId]) {
    state.pendingModules[moduleId] = loadModule(moduleId)
  }
  return state.pendingModules[moduleId]
}

export const loadCommand = async (command) => {
  if (command in state.commands) {
    return
  }
  await getOrLoadModule(ModuleMap.getModuleId(command))
}

export const register = (commandId, listener) => {
  if (commandId.split('.').length >= 3) {
    debugger
  }
  state.commands[commandId] = listener
}

export const registerMultiple = (commands) => {
  Object.assign(state.commands, commands)
}

const hasThrown = new Set()

export const execute = (command, ...args) => {
  if (command in state.commands) {
    const fn = state.commands[command]
    if (typeof fn !== 'function') {
      throw new TypeError(`[renderer-worker] Command ${command} is not a function`)
    }
    return fn(...args)
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
          throw new CommandNotFoundError(command)
        }
        return execute(command, ...args)
      })
  )
}

export const setLoad = (load) => {
  state.load = load
}
