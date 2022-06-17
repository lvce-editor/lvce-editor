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
const MODULE_RENDERER_WORKER = 33
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
    case MODULE_RENDERER_WORKER:
      return import('../RendererWorker/RendererWorker.ipc.js')
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
    case 281:
    case 282:
    case 283:
    case 284:
      return MODULE_DEVELOPER
    case 549:
    case 550:
    case 551:
      return MODULE_VIEW_SERVICE
    case 755:
    case 756:
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
    case 991:
    case 992:
    case 993:
    case 994:
    case 995:
    case 996:
    case 997:
    case 998:
    case 999:
      return MODULE_NOTIFICATION
    case 1100:
    case 1101:
    case 1102:
    case 1103:
    case 1104:
    case 1105:
    case 1106:
    case 1107:
    case 1108:
    case 1109:
    case 1110:
    case 1111:
    case 2222:
    case 2223:
      return MODULE_LAYOUT
    case 3022:
    case 3023:
    case 3024:
    case 3025:
    case 3026:
    case 3027:
    case 3028:
    case 3029:
    case 3030:
    case 3031:
    case 3032:
    case 3033:
    case 3034:
    case 3035:
    case 3036:
    case 3037:
    case 3038:
      return MODULE_VIEWLET
    case 3211:
    case 3212:
    case 3213:
    case 3214:
    case 3215:
    case 3216:
    case 3217:
    case 3218:
    case 3219:
      return MODULE_AUDIO
    case 3666:
    case 3667:
    case 3668:
    case 3669:
    case 3670:
    case 3671:
    case 3672:
    case 3673:
    case 3674:
    case 3675:
    case 3676:
    case 3677:
    case 3678:
    case 3679:
      return MODULE_IMAGE_PREVIEW
    case 3700:
    case 3701:
    case 3702:
    case 3703:
    case 3704:
    case 3705:
      return MODULE_EDITOR_ERROR
    case 4100:
    case 4102:
      return MODULE_FIND_WIDGET
    case 4512:
      return MODULE_EDITOR_RENAME
    case 4551:
      return MODULE_CSS
    case 5611:
    case 5612:
    case 5613:
    case 5614:
    case 5615:
    case 5616:
    case 5617:
    case 5618:
    case 5619:
      return MODULE_LOCATION
    case 6216:
    case 6217:
    case 6218:
    case 6219:
    case 6220:
    case 6221:
    case 6222:
    case 6223:
    case 6224:
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
    case 7833:
    case 7834:
    case 7835:
    case 7836:
    case 7837:
    case 7838:
    case 7839:
    case 7840:
      return MODULE_DIALOG
    case 7900:
    case 7901:
    case 7902:
    case 7903:
    case 7904:
    case 7905:
    case 7906:
    case 7907:
    case 7908:
    case 7909:
      return MODULE_MENU
    case 8080:
    case 8081:
    case 8082:
    case 8083:
    case 8084:
    case 8085:
      return MODULE_WINDOW
    case 8976:
    case 8977:
    case 8978:
      return MODULE_SESSION_STORAGE
    case 8986:
    case 8987:
    case 8988:
      return MODULE_LOCAL_STORAGE
    case 9922:
      return MODULE_VIEWLET_TERMINAL
    case 11122:
      return MODULE_META
    case 43725:
    case 43726:
    case 43727:
    case 43728:
    case 43729:
      return MODULE_SERVICE_WORKER
    case 909090:
      return MODULE_RENDERER_WORKER
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
