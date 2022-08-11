const MODULE_NOTIFICATION = 2
const MODULE_WINDOW = 14
const MODULE_CONTEXT_MENU = 16
const MODULE_LAYOUT = 17
const MODULE_VIEWLET = 18
const MODULE_WORKBENCH = 19
const MODULE_VIEWLET_QUICK_PICK = 21
// TODO rename to widgetFind and group together with other widgets (contextMenu, hover, tooltip)
const MODULE_FIND_WIDGET = 23
const MODULE_PREFERENCES = 25
const MODULE_DEVELOPER = 26
const MODULE_KEY_BINDINGS = 29
const MODULE_COLOR_PICKER = 33
const MODULE_CLIP_BOARD = 36
const MODULE_AJAX = 37
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
const MODULE_SERVICE_WORKER = 66
const MODULE_IMAGE_PREVIEW = 67
const MODULE_BASE_64 = 68
const MODULE_BLOB = 69
const MODULE_OPEN = 70
const MODULE_AUDIO = 71
const MODULE_LISTENER = 73
const MODULE_SESSION_REPLAY = 78
const MODULE_DOWNLOAD = 79
const MODULE_EXTENSION_HOST_CORE = 80
const MODULE_EXTENSION_META = 81
const MODULE_TEST = 82
const MODULE_TEST_FRAMEWORK = 83
const MODULE_TEST_FRAMEWORK_COMPONENT = 84

export const state = {
  commands: Object.create(null),
  pendingModules: Object.create(null),
}

const loadModule = (moduleId) => {
  switch (moduleId) {
    case MODULE_NOTIFICATION:
      return import('../Notification/Notification.ipc.js')
    case MODULE_WINDOW:
      return import('../Window/Window.ipc.js')
    case MODULE_CONTEXT_MENU:
      return import('../ContextMenu/ContextMenu.ipc.js')
    case MODULE_LAYOUT:
      return import('../Layout/Layout.ipc.js')
    case MODULE_VIEWLET:
      return import('../Viewlet/Viewlet.ipc.js')
    case MODULE_WORKBENCH:
      return import('../Workbench/Workbench.ipc.js')
    case MODULE_VIEWLET_QUICK_PICK:
      return import('../ViewletQuickPick/ViewletQuickPick.ipc.js')
    case MODULE_FIND_WIDGET:
      return import('../FindWidget/FindWidget.ipc.js')
    case MODULE_PREFERENCES:
      return import('../Preferences/Preferences.ipc.js')
    case MODULE_DEVELOPER:
      return import('../Developer/Developer.ipc.js')
    case MODULE_KEY_BINDINGS:
      return import('../KeyBindings/KeyBindings.ipc.js')
    case MODULE_COLOR_PICKER:
      return import('../ColorPicker/ColorPicker.ipc.js')
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
    case MODULE_LISTENER:
      return import('../Listener/Listener.ipc.js')
    case MODULE_SESSION_REPLAY:
      return import('../SessionReplay/SessionReplay.ipc.js')
    case MODULE_DOWNLOAD:
      return import('../Download/Download.ipc.js')
    case MODULE_EXTENSION_HOST_CORE:
      return import('../ExtensionHost/ExtensionHostCore.ipc.js')
    case MODULE_EXTENSION_META:
      return import('../ExtensionMeta/ExtensionMeta.ipc.js')
    case MODULE_TEST:
      return import('../Test/Test.ipc.js')
    case MODULE_TEST_FRAMEWORK:
      return import('../TestFrameWork/TestFrameWork.js')
    case MODULE_TEST_FRAMEWORK_COMPONENT:
      return import('../TestFrameWorkComponent/TestFrameWorkComponent.js')
    default:
      throw new Error(`unknown module "${moduleId}"`)
  }
}

const initializeModule = (module) => {
  if (typeof module.__initialize__ !== 'function') {
    if (module.Commands) {
      for (const [key, value] of module.Commands) {
        register(key, value)
      }
    } else {
      throw new Error(
        `module ${module.name} is missing an initialize function and commands`
      )
    }
  }
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
    case '001':
      return MODULE_TEST_FRAMEWORK
    case '002':
      return MODULE_TEST_FRAMEWORK_COMPONENT
    case 'Download.downloadFile':
    case 'Download.downloadJson':
      return MODULE_DOWNLOAD
    case 'ExtensionHost.startWebExtensionHost':
    case 'ExtensionHost.loadWebExtension':
      return MODULE_EXTENSION_HOST_CORE
    case 'ExtensionMeta.addExtension':
    case 'ExtensionMeta.addWebExtension':
      return MODULE_EXTENSION_META
    case 'Test.execute':
      return MODULE_TEST
    case 'ColorThemeFromJson.createColorThemeFromJson':
      return MODULE_COLOR_THEME_FROM_JSON
    case 'ClipBoard.readText':
    case 'ClipBoard.writeText':
    case 'ClipBoard.writeNativeFiles':
    case 'ClipBoard.readNativeFiles':
      return MODULE_CLIP_BOARD
    case 'Ajax.getJson':
    case 'Ajax.getText':
      return MODULE_AJAX
    case 'ErrorHandling.handleError':
      return MODULE_ERROR_HANDLING
    case 'FileSystem.readFile':
    case 'FileSystem.remove':
    case 'FileSystem.readDirWithFileTypes':
    case 'FileSystem.writeFile':
    case 'FileSystem.mkdir':
      return MODULE_FILE_SYSTEM
    case 'Developer.getStartupPerformanceContent':
    case 'Developer.getMemoryUsageContent':
    case 'Developer.startupPerformance':
    case 'Developer.allocateMemoryInSharedProcess':
    case 'Developer.crashSharedProcess':
    case 'Developer.createSharedProcessHeapSnapshot':
    case 'Developer.createSharedProcessProfile':
    case 'Developer.showIconThemeCss':
    case 'Developer.reloadIconTheme':
    case 'Developer.clearCache':
    case 'Developer.reloadColorTheme':
    case 'Developer.showColorThemeCss':
    case 'Developer.toggleDeveloperTools':
    case 'Developer.crashMainProcess':
    case 'Developer.showStartupPerformance':
    case 'Developer.showMemoryUsage':
    case 'Developer.openConfigFolder':
    case 'Developer.openDataFolder':
    case 'Developer.openLogsFolder':
    case 'Developer.openCacheFolder':
    case 'Developer.openProcessExplorer':
    case 'Developer.downloadViewletState':
      return MODULE_DEVELOPER
    case 'Notification.create':
    case 'Notification.dispose':
    case 'Notification.showWithOptions':
    case 'Notification.handleClick':
      return MODULE_NOTIFICATION
    case 'ContextMenu.select':
    case 'ContextMenu.show':
    case 'ContextMenu.hide':
    case 'ContextMenu.focusFirst':
    case 'ContextMenu.focusLast':
    case 'ContextMenu.focusNext':
    case 'ContextMenu.focusPrevious':
    case 'ContextMenu.selectCurrent':
    case 'ContextMenu.noop':
      return MODULE_CONTEXT_MENU
    case 'Layout.showSideBar':
    case 'Layout.hideSideBar':
    case 'Layout.toggleSideBar':
    case 'Layout.showPanel':
    case 'Layout.hidePanel':
    case 'Layout.togglePanel':
    case 'Layout.showActivityBar':
    case 'Layout.hideActivityBar':
    case 'Layout.toggleActivityBar':
    case 'Layout.hydrate':
    case 'Layout.hide':
    case 'Layout.handleResize':
    case 'Layout.handleSashPointerMove':
    case 'Layout.handleSashPointerDown':
      return MODULE_LAYOUT
    case 'Preferences.openSettingsJson':
    case 'Preferences.openKeyBindingsJson':
    case 'Preferences.hydrate':
      return MODULE_PREFERENCES
    case 'Open.openNativeFolder':
    case 'Open.openUrl':
      return MODULE_OPEN
    case 'ColorPicker.open':
    case 'ColorPicker.close':
      return MODULE_COLOR_PICKER
    case 'KeyBindings.handleKeyBinding':
    case 'KeyBindings.hydrate':
      return MODULE_KEY_BINDINGS
    case 'Dialog.openFolder':
    case 'Dialog.showAbout':
    case 'Dialog.showMessage':
    case 'Dialog.close':
    case 'Dialog.handleClick':
      return MODULE_DIALOG
    case 2133:
    case 'Viewlet.getAllStates':
    case 'Viewlet.openWidget':
      return MODULE_VIEWLET
    case 'IconTheme.getIconThemeCss':
    case 'IconTheme.hydrate':
    case 'IconTheme.addIcons':
      return MODULE_ICON_THEME
    case 'EditorRename.open':
    case 'EditorRename.finish':
    case 'EditorRename.abort':
      return MODULE_EDITOR_RENAME
    case 'Format.hydrate':
      return MODULE_FORMAT
    case 3444:
      return MODULE_LISTENER
    case 3900:
      return MODULE_EDITOR_ERROR
    case 'Blob.base64StringToBlob':
      return MODULE_BLOB
    case 'Audio.playBell':
      return MODULE_AUDIO
    case 'TitleBarMenuBar.toggleIndex':
    case 'TitleBarMenuBar.hydrate':
    case 'TitleBarMenuBar.focus':
    case 'TitleBarMenuBar.focusIndex':
    case 'TitleBarMenuBar.focusPrevious':
    case 'TitleBarMenuBar.focusNext':
    case 'TitleBarMenuBar.closeMenu':
    case 'TitleBarMenuBar.openMenu':
    case 'TitleBarMenuBar.handleKeyArrowDown':
    case 'TitleBarMenuBar.handleKeyArrowUp':
    case 'TitleBarMenuBar.handleKeyArrowRight':
    case 'TitleBarMenuBar.handleKeyHome':
    case 'TitleBarMenuBar.handleKeyEnd':
    case 'TitleBarMenuBar.handleKeySpace':
    case 'TitleBarMenuBar.handleKeyEnter':
    case 'TitleBarMenuBar.handleKeyEscape':
    case 'TitleBarMenuBar.handleKeyArrowLeft':
      return MODULE_TITLE_BAR_MENU
    case 'FindInWorkspace.findInWorkspace':
      return MODULE_FIND_IN_WORKSPACE
    case 'RecentlyOpened.getRecentlyOpened':
    case 'RecentlyOpened.clearRecentlyOpened':
    case 'RecentlyOpened.addToRecentlyOpened':
    case 'RecentlyOpened.hydrate':
      return MODULE_RECENTLY_OPENED
    case 'ColorTheme.hydrate':
    case 'ColorTheme.setColorTheme':
      return MODULE_COLOR_THEME

    // TODO this should be in layout module
    case 'Navigation.focusPreviousPart':
    case 'Navigation.focusNextPart':
    case 'Navigation.focusActivityBar':
    case 'Navigation.focusStatusBar':
    case 'Navigation.focusPanel':
    case 'Navigation.focusSideBar':
    case 'Navigation.focusTitleBar':
    case 'Navigation.focusMain':
      return MODULE_NAVIGATION
    case 'ServiceWorker.hydrate':
    case 'ServiceWorker.uninstall':
      return MODULE_SERVICE_WORKER
    case 'SaveState.hydrate':
    case 'SaveState.handleVisibilityChange':
      return MODULE_SAVE_STATE
    case 'SessionStorage.clear':
    case 'SessionStorage.getJson':
      return MODULE_SESSION_STORAGE
    case 'CacheStorage.clearCache':
    case 'CacheStorage.setJson':
    case 'CacheStorage.getJson':
      return MODULE_CACHE_STORAGE
    case 'LocalStorage.clear':
    case 'LocalStorage.setJson':
    case 'LocalStorage.getJson':
    case 'LocalStorage.getText':
    case 'LocalStorage.setText':
    case 'LocalStorage.getItem':
      return MODULE_LOCAL_STORAGE
    case 'Menu.show':
    case 'Menu.hide':
    case 'Menu.selectIndex':
    case 'Menu.focusNext':
    case 'Menu.focusPrevious':
    case 'Menu.focusFirst':
    case 'Menu.focusLast':
    case 'Menu.focusIndex':
    case 'Menu.handleMouseEnter':
    case 'Menu.selectItem':
      return MODULE_MENU
    case 'Workspace.setPath':
    case 'Workspace.hydrate':
    case 'Workspace.setUri':
      return MODULE_WORKSPACE
    case 'Base64.decode':
      return MODULE_BASE_64
    case 'Window.reload':
    case 'Window.minimize':
    case 'Window.maximize':
    case 'Window.unmaximize':
    case 'Window.close':
    case 'Window.makeScreenshot':
    case 'Window.openNew':
    case 'Window.exit':
      return MODULE_WINDOW
    case 'EditorDiagnostics.hydrate':
      return MODULE_EDITOR_DIAGNOSTICS
    case 'KeyBindingsInitial.getKeyBindings':
      return MODULE_KEY_BINDINGS_INITIAL
    case 'ImagePreview.show':
    case 'ImagePreview.hide':
      return MODULE_IMAGE_PREVIEW
    case 'Callback.resolve':
    case 'Callback.reject':
      return MODULE_CALLBACK
    case 'QuickPick.selectCurrentIndex':
    case 'QuickPick.handleInput':
    case 'QuickPick.selectIndex':
    case 'QuickPick.focusFirst':
    case 'QuickPick.focusLast':
    case 'QuickPick.focusPrevious':
    case 'QuickPick.focusNext':
    case 'QuickPick.handleBlur':
      return MODULE_VIEWLET_QUICK_PICK
    case 'FindWidget.create':
    case 'FindWidget.dispose':
    case 'FindWidget.setValue':
      return MODULE_FIND_WIDGET
    case 'SessionReplay.downloadSession':
    case 'SessionReplay.replaySession':
    case 'SessionReplay.replayCurrentSession':
    case 'SessionReplay.openSession':
      return MODULE_SESSION_REPLAY
    default:
      throw new Error(`[renderer-worker] command ${commandId} not found`)
  }
}

const loadCommand = (command) => getOrLoadModule(getModuleId(command))

export const register = (commandId, listener) => {
  state.commands[commandId] = listener
}

const hasThrown = new Set()

export const execute = (command, ...args) => {
  if (command in state.commands) {
    if (typeof state.commands[command] !== 'function') {
      throw new Error(`[renderer-worker] Command ${command} is not a function`)
    }
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
