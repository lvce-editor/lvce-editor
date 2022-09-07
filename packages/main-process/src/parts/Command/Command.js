const ModuleId = require('../ModuleId/ModuleId.js')

const commands = Object.create(null)

const pendingModules = Object.create(null)

const loadModule = async (moduleId) => {
  switch (moduleId) {
    case ModuleId.Window:
      return require('../ElectronWindow/ElectronWindow.ipc.js')
    case ModuleId.ElectronWindowAbout:
      return require('../ElectronWindowAbout/ElectronWindowAbout.ipc.js')
    case ModuleId.Dialog:
      return require('../ElectronDialog/ElectronDialog.ipc.js')
    case ModuleId.Developer:
      return require('../ElectronDeveloper/ElectronDeveloper.ipc.js')
    case ModuleId.Beep:
      return require('../ElectronBeep/ElectronBeep.js')
    case ModuleId.AppWindow:
      return require('../AppWindow/AppWindow.ipc.js')
    case ModuleId.App:
      return require('../App/App.ipc.js')
    case ModuleId.ElectronWindowProcessExplorer:
      return require('../ElectronWindowProcessExplorer/ElectronWindowProcessExplorer.ipc.js')
    default:
      throw new Error('unknown module')
  }
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
  if (!pendingModules[moduleId]) {
    const importPromise = loadModule(moduleId)
    pendingModules[moduleId] = importPromise.then(initializeModule)
  }
  return pendingModules[moduleId]
}

const getModuleId = (commandId) => {
  switch (commandId) {
    case 'ElectronApp.exit':
    case 'App.exit':
      return ModuleId.App
    case 'ElectronWindow.minimize':
    case 'ElectronWindow.maximize':
    case 'ElectronWindow.toggleDevtools':
    case 'ElectronWindow.toggleDevtools':
    case 'ElectronWindow.unmaximize':
    case 'ElectronWindow.close':
    case 'ElectronWindow.reload':
      return ModuleId.Window
    case 'ElectronDeveloper.getPerformanceEntries':
    case 'ElectronDeveloper.crashMainProcess':
      return ModuleId.Developer
    case 'AppWindow.createAppWindow':
      return ModuleId.AppWindow
    case 'ElectronWindowProcessExplorer.open':
      return ModuleId.ElectronWindowProcessExplorer
    case 'ElectronWindowAbout.open':
      return ModuleId.ElectronWindowAbout
    case 'ElectronDialog.showOpenDialog':
    case 'ElectronDialog.showMessageBox':
      return ModuleId.Dialog
    case 'ElectronBeep.beep':
      return ModuleId.Beep
    default:
      throw new Error(`method not found ${commandId}`)
  }
}

const loadCommand = (command) => getOrLoadModule(getModuleId(command))

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
