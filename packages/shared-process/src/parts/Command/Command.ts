import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.ts'
import * as ModuleMap from '../ModuleMap/ModuleMap.ts'
import { VError } from '../VError/VError.ts'

export const state: any = {
  commands: Object.create(null),
  async load(moduleId: any): Promise<any> {},
  pendingModules: Object.create(null),
}

const initializeModule = (module: any): any => {
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

const loadModule = async (moduleId: any): Promise<any> => {
  try {
    const module = await state.load(moduleId)
    initializeModule(module)
  } catch (error) {
    if (error && error instanceof SyntaxError && error.stack === `SyntaxError: ${error.message}`) {
      Error.captureStackTrace(error, loadModule)
    }
    throw new VError(error, `failed to load module ${moduleId}`)
  }
}

const getOrLoadModule = (moduleId: any): any => {
  if (!state.pendingModules[moduleId]) {
    state.pendingModules[moduleId] = loadModule(moduleId)
  }
  return state.pendingModules[moduleId]
}

const loadCommand = async (command: any): Promise<any> => {
  await getOrLoadModule(ModuleMap.getModuleId(command))
}

export const register = (commandId: any, listener: any): any => {
  state.commands[commandId] = listener
}

const hasThrown = new Set()

const executeCommandAsync = async (command: any, ...args: any): Promise<any> => {
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
    throw new CommandNotFoundError(command)
  }
  return state.commands[command](...args)
}

export const execute = (command: any, ...args: any): any => {
  if (command in state.commands) {
    return state.commands[command](...args)
  }
  return executeCommandAsync(command, ...args)
}

export const setLoad = (load: any): any => {
  state.load = load
}
