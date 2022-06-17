const MODULE_WINDOW = 1
const MODULE_ABOUT = 2
const MODULE_DIALOG = 3
const MODULE_DEVELOPER = 4
const MODULE_BEEP = 5
const MODULE_APP_WINDOW = 6
const MODULE_APP = 7
const MODULE_PROCESS_EXPLORER = 8

const commands = Object.create(null)

const pendingModules = Object.create(null)

const loadModule = async (moduleId) => {
  switch (moduleId) {
    case MODULE_WINDOW:
      return require('../Window/Window.ipc.js')
    case MODULE_ABOUT:
      return require('../About/About.ipc.js')
    case MODULE_DIALOG:
      return require('../Dialog/Dialog.ipc.js')
    case MODULE_DEVELOPER:
      return require('../Developer/Developer.ipc.js')
    case MODULE_BEEP:
      return require('../Beep/Beep.js')
    case MODULE_APP_WINDOW:
      return require('../AppWindow/AppWindow.ipc.js')
    case MODULE_APP:
      return require('../App/App.ipc.js')
    case MODULE_PROCESS_EXPLORER:
      return require('../ProcessExplorer/ProcessExplorer.ipc.js')
    default:
      throw new Error('unknown module')
  }
}

const getOrLoadModule = (moduleId) => {
  if (!pendingModules[moduleId]) {
    const importPromise = loadModule(moduleId)
    pendingModules[moduleId] = importPromise.then((module) =>
      module.__initialize__()
    )
  }
  return pendingModules[moduleId]
}

const getModuleId = (commandId) => {
  switch (commandId) {
    case 2211:
      return MODULE_APP
    case 6520:
    case 6521:
    case 6522:
    case 6523:
    case 6524:
    case 6525:
    case 6526:
    case 6528:
    case 6529:
    case 6530:
    case 6531:
    case 6532:
    case 6533:
    case 6534:
    case 6535:
    case 6536:
    case 6537:
    case 6538:
    case 6539:
      return MODULE_WINDOW
    case 7722:
    case 7723:
    case 7724:
    case 7725:
    case 7726:
    case 7727:
    case 7728:
    case 7729:
      return MODULE_DEVELOPER
    case 8527:
      return MODULE_APP_WINDOW
    case 8822:
    case 8823:
    case 8824:
    case 8825:
    case 8826:
    case 8827:
    case 8828:
      return MODULE_PROCESS_EXPLORER
    case 20001:
      return MODULE_ABOUT
    case 20100:
    case 20101:
    case 20102:
    case 20103:
    case 20104:
    case 20105:
    case 20106:
    case 20107:
    case 20108:
    case 20109:
    case 20110:
      return MODULE_DIALOG
    case 50000:
      return MODULE_BEEP
    default:
      throw new Error(`command ${commandId} not found`)
  }
}

const loadCommand = (command) => getOrLoadModule(getModuleId(command))

exports.register = (commandId, listener) => {
  commands[commandId] = listener
}

const hasThrown = new Set()

const execute = (exports.execute = (command, ...args) => {
  if (command in commands) {
    return commands[command](...args)
  }
  return (
    loadCommand(command)
      // TODO can skip then block in prod (only to prevent endless loop in dev)
      .then(() => {
        if (!(command in commands)) {
          if (hasThrown.has(command)) {
            return
          }
          hasThrown.add(command)
          throw new Error(`Command did not register "${command}"`)
        }
        return execute(command, ...args)
      })
  )
})

exports.invoke = async (command, ...args) => {
  if (!(command in commands)) {
    await loadCommand(command)
    if (!(command in commands)) {
      throw new Error(`Unknown command "${command}"`)
    }
  }
  return commands[command](...args)
}
