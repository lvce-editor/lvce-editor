const MODULE_NOTIFICATION = 2
const MODULE_ACTIVITY_BAR = 11
const MODULE_WINDOW = 14
const MODULE_MAIN = 15
const MODULE_CONTEXT_MENU = 16
const MODULE_LAYOUT = 17
const MODULE_VIEWLET = 18
const MODULE_WORKBENCH = 19
const MODULE_VIEWLET_TERMINAL = 20
const MODULE_QUICK_PICK = 21
const MODULE_PANEL = 22
// TODO rename to widgetFind and group together with other widgets (contextMenu, hover, tooltip)
const MODULE_FIND_WIDGET = 23
const MODULE_PREFERENCES = 25
const MODULE_DEVELOPER = 26
const MODULE_EDITOR_COMMAND = 27
const MODULE_EDITOR_COMPLETION = 28
const MODULE_KEY_BINDINGS = 29
const MODULE_EXTENSIONS = 30
const MODULE_VIEWLET_EXPLORER = 31
const MODULE_SOURCE_CONTROL = 32
const MODULE_COLOR_PICKER = 33
const MODULE_VIEWLET_EXTENSIONS = 34
const MODULE_TITLE_BAR = 35
const MODULE_CLIP_BOARD = 36
const MODULE_AJAX = 37
const MODULE_VIEWLET_SIDE_BAR = 38
const MODULE_STATUS_BAR = 39
const MODULE_FORMAT = 40
const MODULE_COLOR_THEME = 41
const MODULE_ICON_THEME = 42
const MODULE_MENU = 43
const MODULE_TITLE_BAR_MENU = 44
const MODULE_ERROR_HANDLING = 45
const MODULE_NAVIGATION = 46
const MODULE_CACHE_STORAGE = 47
const MODULE_LOCAL_STORAGE = 48
const MODULE_SESSION_STORAGE = 49
const MODULE_CALLBACK = 50
const MODULE_DIALOG = 51
const MODULE_COMMAND_INFO = 52
const MODULE_WORKSPACE = 53
const MODULE_COLOR_THEME_FROM_JSON = 54
const MODULE_RECENTLY_OPENED = 55
const MODULE_FILE_SYSTEM = 56
const MODULE_FIND_IN_WORKSPACE = 57
const MODULE_EDITOR_DIAGNOSTICS = 58
const MODULE_EDITOR_RENAME = 60
const MODULE_EDITOR_ERROR = 62
const MODULE_KEY_BINDINGS_INITIAL = 63
const MODULE_SAVE_STATE = 64
const MODULE_VIEWLET_SOURCE_CONTROL = 65
const MODULE_SERVICE_WORKER = 66
const MODULE_IMAGE_PREVIEW = 67
const MODULE_BASE_64 = 68
const MODULE_BLOB = 69
const MODULE_OPEN = 70
const MODULE_AUDIO = 71
const MODULE_VIEWLET_STATUS_BAR = 72
const MODULE_LISTENER = 73
const MODULE_VIEWLET_SEARCH = 74
const MODULE_VIEWLET_EDITOR_COMPLETION = 75
const MODULE_VIEWLET_Locations = 76
const MODULE_VIEWLET_PROBLEMS = 77

export const state = {
  commands: Object.create(null),
  pendingModules: Object.create(null),
}

const loadModule = (moduleId) => {
  switch (moduleId) {
    case MODULE_NOTIFICATION:
      return import('../Notification/Notification.ipc.js')
    case MODULE_ACTIVITY_BAR:
      return import('../Viewlet/ViewletActivityBar.ipc.js')
    case MODULE_WINDOW:
      return import('../Window/Window.ipc.js')
    case MODULE_MAIN:
      return import('../Viewlet/ViewletMain.ipc.js')
    case MODULE_CONTEXT_MENU:
      return import('../ContextMenu/ContextMenu.ipc.js')
    case MODULE_LAYOUT:
      return import('../Layout/Layout.ipc.js')
    case MODULE_VIEWLET:
      return import('../Viewlet/Viewlet.ipc.js')
    case MODULE_WORKBENCH:
      return import('../Workbench/Workbench.ipc.js')
    case MODULE_QUICK_PICK:
      return import('../QuickPick/QuickPick.ipc.js')
    case MODULE_PANEL:
      return import('../Panel/Panel.ipc.js')
    case MODULE_FIND_WIDGET:
      return import('../FindWidget/FindWidget.ipc.js')
    case MODULE_PREFERENCES:
      return import('../Preferences/Preferences.ipc.js')
    case MODULE_DEVELOPER:
      return import('../Developer/Developer.ipc.js')
    case MODULE_EDITOR_COMMAND:
      return import('../EditorCommand/EditorCommand.ipc.js')
    case MODULE_KEY_BINDINGS:
      return import('../KeyBindings/KeyBindings.ipc.js')
    case MODULE_EXTENSIONS:
      return import('../Extensions/Extensions.ipc.js')
    case MODULE_VIEWLET_EXPLORER:
      return import('../Viewlet/ViewletExplorer.ipc.js')
    case MODULE_SOURCE_CONTROL:
      return import('../SourceControl/SourceControl.ipc.js')
    case MODULE_VIEWLET_TERMINAL:
      return import('../Viewlet/ViewletTerminal.ipc.js')
    case MODULE_COLOR_PICKER:
      return import('../ColorPicker/ColorPicker.ipc.js')
    case MODULE_VIEWLET_EXTENSIONS:
      return import('../Viewlet/ViewletExtensions.ipc.js')
    case MODULE_CLIP_BOARD:
      return import('../ClipBoard/ClipBoard.ipc.js')
    case MODULE_AJAX:
      return import('../Ajax/Ajax.ipc.js')
    case MODULE_FORMAT:
      return import('../Format/Format.ipc.js')
    case MODULE_COLOR_THEME:
      return import('../ColorTheme/ColorTheme.ipc.js')
    case MODULE_ICON_THEME:
      return import('../IconTheme/IconTheme.ipc.js')
    case MODULE_MENU:
      return import('../Menu/Menu.ipc.js')
    case MODULE_TITLE_BAR_MENU:
      return import('../TitleBarMenuBar/TitleBarMenuBar.ipc.js')
    case MODULE_ERROR_HANDLING:
      return import('../ErrorHandling/ErrorHandling.ipc.js')
    case MODULE_NAVIGATION:
      return import('../Navigation/Navigation.ipc.js')
    case MODULE_CACHE_STORAGE:
      return import('../CacheStorage/CacheStorage.ipc.js')
    case MODULE_LOCAL_STORAGE:
      return import('../LocalStorage/LocalStorage.ipc.js')
    case MODULE_SESSION_STORAGE:
      return import('../SessionStorage/SessionStorage.ipc.js')
    case MODULE_CALLBACK:
      return import('../Callback/Callback.ipc.js')
    case MODULE_COMMAND_INFO:
      return import('../CommandInfo/CommandInfo.ipc.js')
    case MODULE_DIALOG:
      return import('../Dialog/Dialog.ipc.js')
    case MODULE_WORKSPACE:
      return import('../Workspace/Workspace.ipc.js')
    case MODULE_COLOR_THEME_FROM_JSON:
      return import('../ColorThemeFromJson/ColorThemeFromJson.ipc.js')
    case MODULE_RECENTLY_OPENED:
      return import('../RecentlyOpened/RecentlyOpened.ipc.js')
    case MODULE_FILE_SYSTEM:
      return import('../FileSystem/FileSystem.ipc.js')
    case MODULE_FIND_IN_WORKSPACE:
      return import('../FindInWorkspace/FindInWorkspace.ipc.js')
    case MODULE_EDITOR_DIAGNOSTICS:
      return import('../EditorDiagnostics/EditorDiagnostics.ipc.js')
    case MODULE_EDITOR_RENAME:
      return import('../EditorRename/EditorRename.ipc.js')
    case MODULE_EDITOR_ERROR:
      return import('../EditorError/EditorError.ipc.js')
    case MODULE_KEY_BINDINGS_INITIAL:
      return import('../KeyBindingsInitial/KeyBindingsInitial.ipc.js')
    case MODULE_SAVE_STATE:
      return import('../SaveState/SaveState.ipc.js')
    case MODULE_VIEWLET_SOURCE_CONTROL:
      return import('../Viewlet/ViewletSourceControl.ipc.js')
    case MODULE_SERVICE_WORKER:
      return import('../ServiceWorker/ServiceWorker.ipc.js')
    case MODULE_IMAGE_PREVIEW:
      return import('../ImagePreview/ImagePreview.ipc.js')
    case MODULE_BASE_64:
      return import('../Base64/Base64.ipc.js')
    case MODULE_BLOB:
      return import('../Blob/Blob.ipc.js')
    case MODULE_OPEN:
      return import('../Open/Open.ipc.js')
    case MODULE_AUDIO:
      return import('../Audio/Audio.ipc.js')
    case MODULE_VIEWLET_SIDE_BAR:
      return import('../Viewlet/ViewletSideBar.ipc.js')
    case MODULE_VIEWLET_STATUS_BAR:
      return import('../Viewlet/ViewletStatusBar.ipc.js')
    case MODULE_LISTENER:
      return import('../Listener/Listener.ipc.js')
    case MODULE_VIEWLET_SEARCH:
      return import('../Viewlet/ViewletSearch.ipc.js')
    case MODULE_VIEWLET_EDITOR_COMPLETION:
      return import('../Viewlet/ViewletEditorCompletion.ipc.js')
    case MODULE_VIEWLET_Locations:
      return import('../Viewlet/ViewletLocations.ipc.js')
    case MODULE_VIEWLET_PROBLEMS:
      return import('../Viewlet/ViewletProblems.ipc.js')
    default:
      throw new Error(`unknown module "${moduleId}"`)
  }
}

const initializeModule = (module) => {
  return module.__initialize__()
}

const getOrLoadModule = (moduleId) => {
  if (!state.pendingModules[moduleId]) {
    const importPromise = loadModule(moduleId)
    state.pendingModules[moduleId] = importPromise.then(initializeModule)
  }
  return state.pendingModules[moduleId]
}

const getModuleId = (commandId) => {
  switch (commandId) {
    case 87:
    case 88:
    case 89:
    case 90:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 97:
    case 98:
    case 99:
    case 100:
    case 101:
    case 102:
    case 103:
    case 104:
    case 105:
    case 106:
    case 107:
    case 108:
    case 109:
    case 110:
    case 111:
    case 112:
    case 113:
    case 114:
    case 115:
    case 116:
    case 117:
    case 118:
    case 119:
    case 120:
      return MODULE_MAIN
    case 142:
    case 143:
    case 144:
    case 145:
    case 146:
    case 147:
    case 148:
    case 149:
    case 150:
    case 151:
    case 152:
    case 153:
    case 154:
    case 155:
    case 156:
    case 157:
    case 158:
    case 159:
    case 160:
    case 161:
    case 162:
    case 163:
    case 164:
    case 165:
    case 166:
    case 167:
    case 168:
    case 169:
      return MODULE_VIEWLET_EXPLORER
    case 232:
      return MODULE_COLOR_THEME_FROM_JSON
    case 240:
    case 241:
    case 242:
    case 243:
    case 244:
    case 245:
    case 246:
    case 247:
    case 248:
      return MODULE_CLIP_BOARD
    case 270:
    case 271:
    case 272:
    case 273:
    case 274:
    case 275:
    case 276:
    case 277:
    case 278:
    case 279:
      return MODULE_AJAX
    case 341:
    case 342:
    case 343:
    case 344:
    case 345:
    case 346:
    case 347:
    case 348:
    case 349:
    case 350:
    case 351:
    case 352:
    case 353:
    case 354:
    case 355:
    case 356:
    case 357:
    case 358:
    case 359:
    case 360:
    case 361:
    case 362:
    case 363:
    case 364:
    case 365:
    case 366:
    case 367:
    case 368:
    case 369:
    case 370:
    case 371:
    case 372:
    case 373:
    case 374:
    case 375:
    case 376:
    case 377:
    case 378:
    case 379:
    case 380:
    case 381:
    case 382:
    case 383:
    case 384:
    case 385:
    case 386:
    case 387:
    case 388:
    case 389:
    case 390:
    case 391:
    case 392:
    case 393:
    case 394:
    case 395:
    case 396:
    case 397:
    case 398:
    case 399:
    case 400:
    case 401:
    case 402:
    case 403:
    case 404:
    case 405:
    case 406:
    case 407:
    case 408:
    case 409:
    case 410:
    case 411:
    case 412:
    case 413:
    case 'ExtensionHost.start':
    case 415:
    case 416:
    case 417:
    case 'ExtensionHost.setWorkspaceRoot':
    case 419:
    case 420:
    case 421:
    case 422:
    case 423:
    case 424:
    case 425:
    case 426:
      return MODULE_EDITOR_COMMAND

    case 440:
      return MODULE_ERROR_HANDLING
    case 500:
    case 501:
    case 502:
    case 503:
    case 504:
    case 505:
    case 506:
    case 507:
    case 508:
    case 509:
      return MODULE_FILE_SYSTEM
    case 551:
    case 552:
    case 553:
    case 554:
    case 555:
    case 556:
    case 557:
    case 558:
    case 559:
    case 560:
      return MODULE_VIEWLET_SIDE_BAR
    case 600:
    case 601:
    case 602:
    case 603:
    case 604:
    case 605:
      return MODULE_STATUS_BAR
    case 711:
    case 712:
    case 713:
      return MODULE_PANEL
    case 820:
    case 821:
    case 822:
    case 823:
    case 824:
    case 825:
    case 826:
    case 827:
    case 828:
    case 829:
    case 830:
    case 831:
    case 832:
    case 833:
    case 834:
    case 835:
    case 836:
    case 837:
    case 838:
    case 839:
      return MODULE_DEVELOPER
    case 860:
    case 861:
    case 862:
    case 863:
    case 864:
    case 865:
    case 866:
    case 867:
    case 868:
    case 869:
    case 870:
    case 871:
    case 872:
    case 873:
    case 874:
    case 875:
    case 876:
    case 877:
    case 878:
    case 879:
      return MODULE_VIEWLET_EXTENSIONS
    case 900:
    case 901:
    case 902:
    case 903:
    case 904:
    case 905:
    case 906:
    case 907:
    case 908:
      return MODULE_NOTIFICATION
    case 950:
    case 951:
    case 952:
    case 953:
    case 954:
    case 955:
    case 956:
    case 957:
    case 958:
    case 959:
    case 960:
    case 961:
    case 962:
    case 963:
    case 964:
      return MODULE_CONTEXT_MENU
    case 982:
    case 983:
    case 984:
    case 985:
    case 986:
    case 987:
      return MODULE_VIEWLET_EDITOR_COMPLETION
    case 980:
    case 981:
    case 988:
    case 989:
    case 990:
    case 991:
    case 992:
    case 993:
    case 994:
    case 995:
    case 996:
    case 997:
    case 998:
    case 999:
    case 1000:
    case 1001:
    case 1002:
    case 1003:
    case 1004:
    case 1005:
    case 1006:
    case 1007:
    case 1008:
    case 1009:
    case 1010:
    case 1011:
    case 1012:
    case 1013:
    case 1014:
    case 1015:
    case 1016:
    case 1017:
      return MODULE_EDITOR_COMMAND
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
    case 1112:
    case 1113:
    case 1114:
    case 1115:
    case 1116:
    case 1117:
    case 1118:
    case 1119:
      return MODULE_LAYOUT
    case 1200:
    case 1201:
    case 1202:
    case 1203:
    case 1204:
    case 1205:
    case 1206:
    case 1207:
    case 1208:
    case 1209:
    case 1210:
      return MODULE_PREFERENCES
    case 1300:
      return MODULE_SOURCE_CONTROL
    case 1370:
    case 1371:
    case 1372:
    case 1373:
      return MODULE_OPEN
    case 1400:
      return MODULE_COLOR_PICKER
    case 1422:
    case 1423:
      return MODULE_KEY_BINDINGS
    case 1492:
    case 1493:
    case 1494:
    case 1495:
    case 1496:
      return MODULE_DIALOG
    case 1592:
      return MODULE_COMMAND_INFO
    case 2133:
      return MODULE_VIEWLET
    case 2260:
      return MODULE_VIEWLET_STATUS_BAR
    case 3030:
    case 3031:
    case 3032:
    case 3033:
    case 3034:
    case 3035:
      return MODULE_ICON_THEME
    case 3300:
    case 3301:
    case 3302:
    case 3303:
    case 3304:
    case 3305:
    case 3306:
      return MODULE_EDITOR_RENAME
    case 3380:
      return MODULE_FORMAT
    case 3444:
      return MODULE_LISTENER
    case 3900:
      return MODULE_EDITOR_ERROR
    case 4356:
      return MODULE_BLOB
    case 4444:
    case 4445:
    case 4446:
    case 4447:
    case 4448:
      return MODULE_AUDIO
    case 4510:
    case 4511:
    case 4512:
    case 4513:
    case 4514:
    case 4515:
    case 4516:
    case 4517:
    case 4518:
    case 4519:
      return MODULE_TITLE_BAR
    case 4610:
    case 4611:
    case 4612:
    case 4613:
    case 4614:
    case 4615:
    case 4616:
    case 4617:
    case 4618:
    case 4619:
    case 4620:
    case 4621:
    case 4622:
    case 4623:
    case 4624:
    case 4625:
    case 4627:
    case 4628:
    case 4629:
      return MODULE_TITLE_BAR_MENU
    case 4870:
    case 4871:
      return MODULE_VIEWLET_TERMINAL
    case 5200:
    case 5201:
    case 5202:
    case 5203:
    case 5204:
    case 5205:
      return MODULE_FIND_IN_WORKSPACE
    case 5430:
    case 5431:
    case 5432:
    case 5433:
    case 5434:
    case 5435:
      return MODULE_RECENTLY_OPENED
    case 5610:
    case 5611:
    case 5612:
    case 5613:
    case 5614:
    case 5615:
    case 5616:
    case 5617:
    case 5618:
    case 5619:
    case 5620:
      return MODULE_COLOR_THEME
    case 5740:
    case 5741:
    case 5742:
    case 5743:
    case 5744:
    case 5745:
    case 5746:
    case 5747:
      return MODULE_NAVIGATION
    case 5783:
    case 5784:
    case 5785:
    case 5786:
    case 5787:
    case 5788:
    case 5789:
    case 5790:
      return MODULE_SERVICE_WORKER
    case 6532:
      return MODULE_VIEWLET_SOURCE_CONTROL
    case 6661:
      return MODULE_SAVE_STATE
    case 6755:
    case 6756:
    case 6757:
    case 6758:
    case 6759:
    case 6770:
      return MODULE_SESSION_STORAGE
    case 6800:
    case 6801:
    case 6802:
      return MODULE_CACHE_STORAGE
    case 6900:
    case 6901:
    case 6902:
      return MODULE_LOCAL_STORAGE
    case 7100:
    case 7101:
    case 7102:
    case 7103:
    case 7104:
    case 7105:
    case 7106:
    case 7107:
    case 7108:
    case 7109:
    case 7110:
    case 7111:
    case 7112:
    case 7113:
    case 7114:
    case 7115:
    case 7116:
    case 7117:
    case 7118:
    case 7119:
      return MODULE_VIEWLET_Locations
    case 7400:
    case 7401:
    case 7402:
    case 7403:
    case 7404:
    case 7405:
    case 7406:
    case 7407:
    case 7408:
    case 7409:
    case 7410:
      return MODULE_MENU
    case 7550:
    case 7551:
    case 7552:
    case 7553:
    case 7554:
    case 7555:
    case 7556:
    case 7557:
    case 7558:
    case 7559:
      return MODULE_VIEWLET_PROBLEMS
    case 7633:
    case 7634:
    case 7635:
    case 7636:
    case 7637:
    case 7638:
    case 7639:
      return MODULE_WORKSPACE
    case 7650:
    case 7651:
      return MODULE_EXTENSIONS
    case 7890:
      return MODULE_BASE_64
    case 8000:
    case 8001:
    case 8002:
    case 8003:
    case 8004:
    case 8005:
    case 8006:
    case 8007:
    case 8008:
    case 8009:
    case 8010:
    case 8011:
    case 8012:
    case 8013:
    case 8014:
    case 8015:
    case 8016:
    case 8017:
    case 8018:
    case 8019:
    case 8020:
    case 8021:
    case 8022:
      return MODULE_ACTIVITY_BAR
    case 8080:
    case 8081:
    case 8082:
    case 8083:
    case 8084:
    case 8085:
    case 8086:
    case 8087:
    case 8088:
    case 8089:
    case 8090:
    case 8091:
    case 8092:
    case 8093:
    case 8094:
    case 8095:
    case 8096:
    case 8097:
    case 8098:
    case 8099:
      return MODULE_WINDOW
    case 8786:
    case 8787:
    case 8788:
    case 8789:
    case 8790:
      return MODULE_EDITOR_DIAGNOSTICS
    case 8961:
    case 8962:
      return MODULE_KEY_BINDINGS_INITIAL
    case 9081:
    case 9082:
    case 9083:
    case 9084:
    case 9085:
      return MODULE_IMAGE_PREVIEW
    case 9444:
    case 9445:
    case 9446:
    case 9447:
    case 9448:
    case 9449:
    case 9450:
    case 9451:
    case 9452:
    case 9453:
    case 9454:
    case 9455:
    case 9456:
    case 9457:
    case 9458:
    case 9459:
    case 9460:
    case 9461:
    case 9462:
    case 9463:
    case 9464:
    case 9465:
    case 9466:
    case 9467:
    case 9468:
    case 9469:
      return MODULE_VIEWLET_SEARCH
    case 47110:
      return MODULE_WORKBENCH
    case 67330:
    case 67331:
      return MODULE_CALLBACK
    case 71179:
    case 71178:
    case 71180:
    case 71181:
    case 7611:
    case 7612:
    case 18920:
    case 18921:
    case 18922:
    case 18923:
    case 18924:
    case 18925:
    case 18926:
    case 18927:
    case 18928:
    case 18929:
    case 18930:
    case 18931:
    case 18932:
    case 18933:
    case 18934:
    case 18935:
      return MODULE_QUICK_PICK
    case 212333:
    case 212334:
    case 4101:
    case 4102:
      return MODULE_FIND_WIDGET
    default:
      throw new Error(`command ${commandId} not found`)
  }
}

const loadCommand = (command) => getOrLoadModule(getModuleId(command))

export const register = (commandId, listener) => {
  state.commands[commandId] = listener
}

const hasThrown = new Set()

export const execute = (command, ...args) => {
  if (command in state.commands) {
    return state.commands[command](...args)
  }
  return (
    loadCommand(command)
      // TODO can skip then block in prod (only to prevent endless loop in dev)
      .then(() => {
        if (!(command in state.commands)) {
          if (hasThrown.has(command)) {
            return
          }
          hasThrown.add(command)
          throw new Error(`Command did not register "${command}"`)
        }
        return execute(command, ...args)
      })
  )
}
