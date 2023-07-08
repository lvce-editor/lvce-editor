import * as CommandState from '../CommandState/CommandState.js'
import * as ModuleMap from '../ModuleMap/ModuleMap.js'

const initializeModule = (module) => {
  if (module.Commands) {
    for (const [key, value] of Object.entries(module.Commands)) {
      if (module.name) {
        const actualKey = `${module.name}.${key}`
        CommandState.registerCommand(actualKey, value)
      } else {
        CommandState.registerCommand(key, value)
      }
    }
    return
  }
  throw new Error(`module ${module.name} is missing an initialize function and commands`)
}

const loadModule = async (moduleId) => {
  try {
    const module = await CommandState.load(moduleId)
    initializeModule(module)
  } catch (error) {
    if (error && error instanceof SyntaxError && error.stack === `SyntaxError: ${error.message}`) {
      Error.captureStackTrace(error, loadModule)
    }
    throw new Error(`failed to load module ${moduleId}`)
  }
}

const getOrLoadModule = (moduleId) => {
  if (!CommandState.hasPendingModule(moduleId)) {
    CommandState.setPendingModule(moduleId, loadModule(moduleId))
  }
  return CommandState.getPendingModule(moduleId)
}

const loadCommand = async (command) => {
  await getOrLoadModule(ModuleMap.getModuleId(command))
}

export const execute = async (command, ...args) => {
  const existing = CommandState.getCommand(command)
  if (existing) {
    return existing(...args)
  }
  await loadCommand(command)
  const fn = CommandState.getCommand(command)
  if (!fn) {
    throw new Error(`Command not found ${command}`)
  }
  return fn(...args)
}
