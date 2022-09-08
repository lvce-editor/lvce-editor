const Module = require('../Module/Module.js')
const ModuleMap = require('../ModuleMap/ModuleMap.js')

const commands = Object.create(null)
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
    pendingModules[moduleId] = importPromise.then(initializeModule)
  }
  return pendingModules[moduleId]
}

const loadCommand = (command) => getOrLoadModule(ModuleMap.getModuleId(command))

const register = (exports.register = (commandId, listener) => {
  commands[commandId] = listener
})

const hasThrown = new Set()

const loadThenExecute = async (command, ...args) => {
  await loadCommand(command)
  // TODO can skip then block in prod (only to prevent endless loop in dev)
  if (!(command in commands)) {
    if (hasThrown.has(command)) {
      return
    }
    hasThrown.add(command)
    throw new Error(`Command did not register "${command}"`)
  }
  return execute(command, ...args)
}

const execute = (command, ...args) => {
  if (command in commands) {
    return commands[command](...args)
  }
  return loadThenExecute(command, ...args)
}

exports.execute = execute

exports.invoke = async (command, ...args) => {
  if (!(command in commands)) {
    await loadCommand(command)
    if (!(command in commands)) {
      throw new Error(`Unknown command "${command}"`)
    }
  }
  return commands[command](...args)
}
