import * as ModuleMap from '../ModuleMap/ModuleMap.ts'
import { VError } from '../VError/VError.ts'

export const state = {
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
  throw new Error(`module ${module.name} is missing an initialize function and commands`)
}

const loadModule = async (moduleId) => {
  try {
    const module = await state.load(moduleId)
    initializeModule(module)
  } catch (error) {
    if (error && error instanceof SyntaxError && error.stack === `SyntaxError: ${error.message}`) {
      // @ts-ignore
      Error.captureStackTrace(error, loadModule)
    }
    throw new VError(error, `failed to load module ${moduleId}`)
  }
}

const getOrLoadModule = (moduleId) => {
  if (!state.pendingModules[moduleId]) {
    state.pendingModules[moduleId] = loadModule(moduleId)
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
    throw new VError(error, `Failed to load command ${command}`)
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
    const fn = state.commands[command]
    if (typeof fn !== 'function') {
      throw new Error(`[renderer-worker] Command ${command} is not a function`)
    }
    return fn(...args)
  }
  return executeCommandAsync(command, ...args)
}

export const setLoad = (load) => {
  state.load = load
}
