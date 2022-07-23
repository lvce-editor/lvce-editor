const MODULE_MAIN = 1
const MODULE_NOTIFICATION = 2
const MODULE_TEST = 3
const MODULE_VIEWLET_SOURCE_CONTROL = 5
const MODULE_VIEW_SERVICE = 9
const MODULE_WINDOW = 14
const MODULE_DEVELOPER = 15
const MODULE_LAYOUT = 16
const MODULE_PANEL = 18
const MODULE_WORKBENCH = 20
const MODULE_VIEWLET = 21
const MODULE_VIEWLET_TERMINAL = 22
const MODULE_FIND_WIDGET = 23
const MODULE_KEYBINDINGS = 26
const MODULE_MENU = 31
const MODULE_SESSION_STORAGE = 34
const MODULE_LOCAL_STORAGE = 35
const MODULE_DIALOG = 36
const MODULE_EDITOR_HOVER = 37
const MODULE_CSS = 38
const MODULE_EDITOR_RENAME = 39
const MODULE_EDITOR_ERROR = 40
const MODULE_EDITOR_CONTROLLER = 41
const MODULE_SERVICE_WORKER = 42
const MODULE_IMAGE_PREVIEW = 43
const MODULE_LOCATION = 44
const MODULE_AUDIO = 45
const MODULE_META = 46
const MODULE_DOWNLOAD = 47
const MODULE_OPEN = 48
const MODULE_CLIPBOARD = 49
const MODULE_INIT_DATA = 50

export const state = {
  commands: Object.create(null),
  pendingModules: Object.create(null),
}

const loadModule = (moduleId) => {
  switch (moduleId) {
    case MODULE_NOTIFICATION:
      return import('../Notification/Notification.ipc.js')
    case MODULE_VIEWLET_SOURCE_CONTROL:
      return import('../Viewlet/ViewletExplorer.js')
    case MODULE_WINDOW:
      return import('../Window/Window.ipc.js')
    case MODULE_DEVELOPER:
      return import('../Developer/Developer.ipc.js')
    case MODULE_LAYOUT:
      return import('../Layout/Layout.ipc.js')
    case MODULE_VIEWLET:
      return import('../Viewlet/Viewlet.ipc.js')
    case MODULE_VIEWLET_TERMINAL:
      return import('../Viewlet/ViewletTerminal.js')
    case MODULE_FIND_WIDGET:
      return import('../FindWidget/FindWidget.ipc.js')
    case MODULE_KEYBINDINGS:
      return import('../KeyBindings/KeyBindings.ipc.js')
    case MODULE_MENU:
      return import('../OldMenu/Menu.ipc.js')
    case MODULE_SESSION_STORAGE:
      return import('../SessionStorage/SessionStorage.ipc.js')
    case MODULE_LOCAL_STORAGE:
      return import('../LocalStorage/LocalStorage.ipc.js')
    case MODULE_DIALOG:
      return import('../Dialog/Dialog.ipc.js')
    case MODULE_EDITOR_HOVER:
      return import('../EditorHover/EditorHover.ipc.js')
    case MODULE_CSS:
      return import('../Css/Css.ipc.js')
    case MODULE_EDITOR_RENAME:
      return import('../EditorRename/EditorRename.ipc.js')
    case MODULE_EDITOR_ERROR:
      return import('../EditorError/EditorError.ipc.js')
    case MODULE_SERVICE_WORKER:
      return import('../ServiceWorker/ServiceWorker.ipc.js')
    case MODULE_IMAGE_PREVIEW:
      return import('../ImagePreview/ImagePreview.ipc.js')
    case MODULE_LOCATION:
      return import('../Location/Location.ipc.js')
    case MODULE_AUDIO:
      return import('../Audio/Audio.ipc.js')
    case MODULE_META:
      return import('../Meta/Meta.ipc.js')
    case MODULE_DOWNLOAD:
      return import('../Download/Download.ipc.js')
    case MODULE_OPEN:
      return import('../Open/Open.ipc.js')
    case MODULE_CLIPBOARD:
      return import('../ClipBoard/ClipBoard.ipc.js')
    case MODULE_INIT_DATA:
      return import('../InitData/InitData.ipc.js')
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
    case 'ClipBoard.readText':
    case 'ClipBoard.writeText':
      return MODULE_CLIPBOARD
    case 'Developer.showState':
    case 'Developer.getMemoryUsage':
      return MODULE_DEVELOPER
    case 'Download.downloadFile':
      return MODULE_DOWNLOAD
    case 'Open.openUrl':
      return MODULE_OPEN
    case 'InitData.getInitData':
      return MODULE_INIT_DATA
    case 549:
    case 550:
    case 551:
      return MODULE_VIEW_SERVICE
    case 'KeyBindings.hydrate':
      return MODULE_KEYBINDINGS
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
      return MODULE_EDITOR_CONTROLLER
    case 'Notification.create':
    case 'Notification.dispose':
    case 'Notification.createWithOptions':
      return MODULE_NOTIFICATION
    case 'Layout.update':
    case 'Layout.hydrate':
    case 'Layout.hide':
    case 'Layout.getBounds':
    case 'Layout.show':
      return MODULE_LAYOUT
    case 'Viewlet.refresh':
    case 'Viewlet.invoke':
    case 'Viewlet.send':
    case 'Viewlet.focus':
    case 'Viewlet.dispose':
    case 'Viewlet.appendViewlet':
    case 'Viewlet.load':
    case 'Viewlet.handleError':
    case 'Viewlet.sendMultiple':
      return MODULE_VIEWLET
    case 'Audio.play':
      return MODULE_AUDIO
    case 'ImagePreview.create':
    case 'ImagePreview.dispose':
    case 'ImagePreview.update':
    case 'ImagePreview.showError':
      return MODULE_IMAGE_PREVIEW
    case 'EditorError.create':
      return MODULE_EDITOR_ERROR

    case 'FindWidget.create':
    case 'FindWidget.dispose':
    case 'FindWidget.setResults':
      return MODULE_FIND_WIDGET
    case 'EditorRename.create':
    case 'EditorRename.finish':
    case 'EditorRename.dispose':
      return MODULE_EDITOR_RENAME
    case 'Css.setInlineStyle':
      return MODULE_CSS
    case 'Location.getPathName':
    case 'Location.setPathName':
    case 'Location.hydrate':
    case 'Location.getHref':
      return MODULE_LOCATION
    case 'EditorHover.create':
      return MODULE_EDITOR_HOVER
    case 6661:
    case 6662:
    case 6663:
    case 6664:
      return MODULE_PANEL
    case 8181:
      return MODULE_VIEWLET_SOURCE_CONTROL
    case 33111:
      return MODULE_WORKBENCH
    case 'Dialog.prompt':
    case 'Dialog.alert':
    case 'Dialog.showErrorDialogWithOptions':
    case 'Dialog.close':
      return MODULE_DIALOG
    case 'Menu.showControlled':
    case 'Menu.hide':
    case 'Menu.focusIndex':
    case 'Menu.showSubMenu':
    case 'Menu.hideSubMenu':
    case 'Menu.showMenu':
    case 'Menu.showContextMenu':
    case 'Menu.show':
      return MODULE_MENU
    case 'Window.reload':
    case 'Window.minimize':
    case 'Window.maximize':
    case 'Window.unmaximize':
    case 'Window.close':
    case 'Window.setTitle':
    case 'Window.onVisibilityChange':
      return MODULE_WINDOW
    case 'SessionStorage.clear':
    case 'SessionStorage.getItem':
    case 'SessionStorage.setItem':
      return MODULE_SESSION_STORAGE
    case 'LocalStorage.clear':
    case 'LocalStorage.getItem':
    case 'LocalStorage.setItem':
      return MODULE_LOCAL_STORAGE
    case 9922:
      return MODULE_VIEWLET_TERMINAL
    case 'Meta.setThemeColor':
      return MODULE_META
    case 'ServiceWorker.register':
    case 'ServiceWorker.uninstall':
      return MODULE_SERVICE_WORKER
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
