import * as ModuleId from '../ModuleId/ModuleId.js'

export const state = {
  commands: Object.create(null),
  pendingModules: Object.create(null),
}

const loadModule = (moduleId) => {
  switch (moduleId) {
    case ModuleId.Notification:
      return import('../Notification/Notification.ipc.js')
    case ModuleId.Window:
      return import('../Window/Window.ipc.js')
    case ModuleId.Developer:
      return import('../Developer/Developer.ipc.js')
    case ModuleId.Layout:
      return import('../Layout/Layout.ipc.js')
    case ModuleId.Viewlet:
      return import('../Viewlet/Viewlet.ipc.js')
    case ModuleId.FindWidget:
      return import('../FindWidget/FindWidget.ipc.js')
    case ModuleId.KeyBindings:
      return import('../KeyBindings/KeyBindings.ipc.js')
    case ModuleId.Menu:
      return import('../OldMenu/Menu.ipc.js')
    case ModuleId.WebStorage:
      return import('../WebStorage/WebStorage.ipc.js')
    case ModuleId.Dialog:
      return import('../Dialog/Dialog.ipc.js')
    case ModuleId.EditorHover:
      return import('../EditorHover/EditorHover.ipc.js')
    case ModuleId.Css:
      return import('../Css/Css.ipc.js')
    case ModuleId.EditorRename:
      return import('../EditorRename/EditorRename.ipc.js')
    case ModuleId.EditorError:
      return import('../EditorError/EditorError.ipc.js')
    case ModuleId.ServiceWorker:
      return import('../ServiceWorker/ServiceWorker.ipc.js')
    case ModuleId.ImagePreview:
      return import('../ImagePreview/ImagePreview.ipc.js')
    case ModuleId.Location:
      return import('../Location/Location.ipc.js')
    case ModuleId.Audio:
      return import('../Audio/Audio.ipc.js')
    case ModuleId.Menu:
      return import('../Meta/Meta.ipc.js')
    case ModuleId.Download:
      return import('../Download/Download.ipc.js')
    case ModuleId.Open:
      return import('../Open/Open.ipc.js')
    case ModuleId.ClipBoard:
      return import('../ClipBoard/ClipBoard.ipc.js')
    case ModuleId.InitData:
      return import('../InitData/InitData.ipc.js')
    case ModuleId.TestFrameWork:
      return import('../TestFrameWork/TestFrameWork.ipc.js')
    default:
      throw new Error('unknown module')
  }
}

const getOrLoadModule = (moduleId) => {
  if (!state.pendingModules[moduleId]) {
    const importPromise = loadModule(moduleId)
    state.pendingModules[moduleId] = importPromise.then((module) =>
      module.__initialize__()
    )
  }
  return state.pendingModules[moduleId]
}

const getModuleId = (commandId) => {
  switch (commandId) {
    case 'TestFrameWork.showOverlay':
    case 'TestFrameWork.performAction':
    case 'TestFrameWork.checkSingleElementCondition':
    case 'TestFrameWork.checkMultiElementCondition':
    case 'TestFrameWork.performKeyBoardAction':
      return ModuleId.TestFrameWork
    case 'ClipBoard.readText':
    case 'ClipBoard.writeText':
      return ModuleId.ClipBoard
    case 'Developer.showState':
    case 'Developer.getMemoryUsage':
      return ModuleId.Developer
    case 'Download.downloadFile':
      return ModuleId.Download
    case 'Open.openUrl':
      return ModuleId.Open
    case 'InitData.getInitData':
      return ModuleId.InitData
    case 549:
    case 550:
    case 551:
      return ModuleId.ViewService
    case 'KeyBindings.hydrate':
      return ModuleId.KeyBindings
    case 764:
    case 765:
    case 766:
    case 767:
    case 768:
    case 769:
    case 770:
    case 771:
    case 772:
    case 773:
    case 774:
    case 775:
    case 776:
    case 777:
      return ModuleId.EditorController
    case 'Notification.create':
    case 'Notification.dispose':
    case 'Notification.createWithOptions':
      return ModuleId.Notification
    case 'Layout.update':
    case 'Layout.hydrate':
    case 'Layout.hide':
    case 'Layout.getBounds':
    case 'Layout.show':
      return ModuleId.Layout
    case 'Viewlet.refresh':
    case 'Viewlet.invoke':
    case 'Viewlet.send':
    case 'Viewlet.focus':
    case 'Viewlet.dispose':
    case 'Viewlet.appendViewlet':
    case 'Viewlet.load':
    case 'Viewlet.handleError':
    case 'Viewlet.sendMultiple':
      return ModuleId.Viewlet
    case 'Audio.play':
      return ModuleId.Audio
    case 'ImagePreview.create':
    case 'ImagePreview.dispose':
    case 'ImagePreview.update':
    case 'ImagePreview.showError':
      return ModuleId.ImagePreview
    case 'EditorError.create':
      return ModuleId.EditorError
    case 'FindWidget.create':
    case 'FindWidget.dispose':
    case 'FindWidget.setResults':
      return ModuleId.FindWidget
    case 'EditorRename.create':
    case 'EditorRename.finish':
    case 'EditorRename.dispose':
      return ModuleId.EditorRename
    case 'Css.setInlineStyle':
      return ModuleId.Css
    case 'Location.getPathName':
    case 'Location.setPathName':
    case 'Location.hydrate':
    case 'Location.getHref':
      return ModuleId.Location
    case 'EditorHover.create':
      return ModuleId.EditorHover
    case 6661:
    case 6662:
    case 6663:
    case 6664:
      return ModuleId.Panel
    case 33111:
      return ModuleId.Workbench
    case 'Dialog.prompt':
    case 'Dialog.alert':
    case 'Dialog.showErrorDialogWithOptions':
    case 'Dialog.close':
      return ModuleId.Dialog
    case 'Menu.showControlled':
    case 'Menu.hide':
    case 'Menu.focusIndex':
    case 'Menu.showSubMenu':
    case 'Menu.hideSubMenu':
    case 'Menu.showMenu':
    case 'Menu.showContextMenu':
    case 'Menu.show':
      return ModuleId.Menu
    case 'Window.reload':
    case 'Window.minimize':
    case 'Window.maximize':
    case 'Window.unmaximize':
    case 'Window.close':
    case 'Window.setTitle':
    case 'Window.onVisibilityChange':
      return ModuleId.Window
    case 'WebStorage.clear':
    case 'WebStorage.getItem':
    case 'WebStorage.setItem':
      return ModuleId.WebStorage
    case 'Meta.setThemeColor':
      return ModuleId.Dialog
    case 'ServiceWorker.register':
    case 'ServiceWorker.uninstall':
      return ModuleId.ServiceWorker
    default:
      throw new Error(`command ${commandId} not found`)
  }
}

const loadCommand = async (command) => {
  await getOrLoadModule(getModuleId(command))
}

export const register = (commandId, listener) => {
  state.commands[commandId] = listener
}

const hasThrown = new Set()

const executeCommandAsync = async (command, ...args) => {
  try {
    await loadCommand(command)
  } catch (error) {
    // @ts-ignore
    throw new Error(`Failed to load command ${command}`, {
      cause: error,
    })
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
    return state.commands[command](...args)
  }
  return executeCommandAsync(command, ...args)
}
