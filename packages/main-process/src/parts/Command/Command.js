const MODULE_WINDOW = 1
const MODULE_ELECTRON_WINDOW_ABOUT = 2
const MODULE_DIALOG = 3
const MODULE_DEVELOPER = 4
const MODULE_BEEP = 5
const MODULE_APP_WINDOW = 6
const MODULE_APP = 7
const MODULE_ELECTRON_WINDOW_PROCESS_EXPLORER = 8

const commands = Object.create(null)

const pendingModules = Object.create(null)

const loadModule = async (moduleId) => {
  switch (moduleId) {
    case MODULE_WINDOW:
      return require('../ElectronWindow/ElectronWindow.ipc.js')
    case MODULE_ELECTRON_WINDOW_ABOUT:
      return require('../ElectronWindowAbout/ElectronWindowAbout.ipc.js')
    case MODULE_DIALOG:
      return require('../ElectronDialog/ElectronDialog.ipc.js')
    case MODULE_DEVELOPER:
      return require('../ElectronDeveloper/ElectronDeveloper.ipc.js')
    case MODULE_BEEP:
      return require('../ElectronBeep/ElectronBeep.js')
    case MODULE_APP_WINDOW:
      return require('../AppWindow/AppWindow.ipc.js')
    case MODULE_APP:
      return require('../App/App.ipc.js')
    case MODULE_ELECTRON_WINDOW_PROCESS_EXPLORER:
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
      return MODULE_APP
    case 'ElectronWindow.minimize':
    case 'ElectronWindow.maximize':
    case 'ElectronWindow.toggleDevtools':
    case 'ElectronWindow.toggleDevtools':
    case 'ElectronWindow.unmaximize':
    case 'ElectronWindow.close':
    case 'ElectronWindow.reload':
      return MODULE_WINDOW
    case 'ElectronDeveloper.getPerformanceEntries':
    case 'ElectronDeveloper.crashMainProcess':
      return MODULE_DEVELOPER
    case 'AppWindow.createAppWindow':
      return MODULE_APP_WINDOW
    case 'ElectronWindowProcessExplorer.open':
      return MODULE_ELECTRON_WINDOW_PROCESS_EXPLORER
    case 'ElectronWindowAbout.open':
      return MODULE_ELECTRON_WINDOW_ABOUT
    case 'ElectronDialog.showOpenDialog':
    case 'ElectronDialog.showMessageBox':
      return MODULE_DIALOG
    case 'ElectronBeep.beep':
      return MODULE_BEEP
    default:
      throw new Error(`command ${commandId} not found`)
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
