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
    case ModuleId.ContextMenu:
      return import('../ContextMenu/ContextMenu.ipc.js')
    case ModuleId.Layout:
      return import('../Layout/Layout.ipc.js')
    case ModuleId.Viewlet:
      return import('../Viewlet/Viewlet.ipc.js')
    case ModuleId.Workbench:
      return import('../Workbench/Workbench.ipc.js')
    case ModuleId.ViewletQuickPick:
      return import('../ViewletQuickPick/ViewletQuickPick.ipc.js')
    case ModuleId.FindWidget:
      return import('../FindWidget/FindWidget.ipc.js')
    case ModuleId.Preferences:
      return import('../Preferences/Preferences.ipc.js')
    case ModuleId.Developer:
      return import('../Developer/Developer.ipc.js')
    case ModuleId.KeyBindings:
      return import('../KeyBindings/KeyBindings.ipc.js')
    case ModuleId.ColorPicker:
      return import('../ColorPicker/ColorPicker.ipc.js')
    case ModuleId.ClipBoard:
      return import('../ClipBoard/ClipBoard.ipc.js')
    case ModuleId.Ajax:
      return import('../Ajax/Ajax.ipc.js')
    case ModuleId.Format:
      return import('../Format/Format.ipc.js')
    case ModuleId.ColorTheme:
      return import('../ColorTheme/ColorTheme.ipc.js')
    case ModuleId.IconTheme:
      return import('../IconTheme/IconTheme.ipc.js')
    case ModuleId.Menu:
      return import('../Menu/Menu.ipc.js')
    case ModuleId.TitleBarMenu:
      return import('../TitleBarMenuBar/TitleBarMenuBar.ipc.js')
    case ModuleId.ErrorHandling:
      return import('../ErrorHandling/ErrorHandling.ipc.js')
    case ModuleId.Navigatiom:
      return import('../Navigation/Navigation.ipc.js')
    case ModuleId.CacheStorage:
      return import('../CacheStorage/CacheStorage.ipc.js')
    case ModuleId.LocalStorage:
      return import('../LocalStorage/LocalStorage.ipc.js')
    case ModuleId.SessionStorage:
      return import('../SessionStorage/SessionStorage.ipc.js')
    case ModuleId.Callback:
      return import('../Callback/Callback.ipc.js')
    case ModuleId.Dialog:
      return import('../Dialog/Dialog.ipc.js')
    case ModuleId.Workspace:
      return import('../Workspace/Workspace.ipc.js')
    case ModuleId.ColorThemeFromJson:
      return import('../ColorThemeFromJson/ColorThemeFromJson.ipc.js')
    case ModuleId.RecentlyOpened:
      return import('../RecentlyOpened/RecentlyOpened.ipc.js')
    case ModuleId.FileSystem:
      return import('../FileSystem/FileSystem.ipc.js')
    case ModuleId.EditorDiagnostics:
      return import('../EditorDiagnostics/EditorDiagnostics.ipc.js')
    case ModuleId.EditorRename:
      return import('../EditorRename/EditorRename.ipc.js')
    case ModuleId.EditorError:
      return import('../EditorError/EditorError.ipc.js')
    case ModuleId.KeyBindingsInitial:
      return import('../KeyBindingsInitial/KeyBindingsInitial.ipc.js')
    case ModuleId.SaveState:
      return import('../SaveState/SaveState.ipc.js')
    case ModuleId.ServiceWorker:
      return import('../ServiceWorker/ServiceWorker.ipc.js')
    case ModuleId.ImagePreview:
      return import('../ImagePreview/ImagePreview.ipc.js')
    case ModuleId.Base64:
      return import('../Base64/Base64.ipc.js')
    case ModuleId.Blob:
      return import('../Blob/Blob.ipc.js')
    case ModuleId.Open:
      return import('../Open/Open.ipc.js')
    case ModuleId.Audio:
      return import('../Audio/Audio.ipc.js')
    case ModuleId.Listener:
      return import('../Listener/Listener.ipc.js')
    case ModuleId.SessionReplay:
      return import('../SessionReplay/SessionReplay.ipc.js')
    case ModuleId.Download:
      return import('../Download/Download.ipc.js')
    case ModuleId.ExtensionHostCode:
      return import('../ExtensionHost/ExtensionHostCore.ipc.js')
    case ModuleId.ExtensionMeta:
      return import('../ExtensionMeta/ExtensionMeta.ipc.js')
    case ModuleId.Test:
      return import('../Test/Test.ipc.js')
    case ModuleId.TestFramework:
      return import('../TestFrameWork/TestFrameWork.js')
    case ModuleId.TestFrameworkComponent:
      return import('../TestFrameWorkComponent/TestFrameWorkComponent.js')
    case ModuleId.Extensions:
      return import('../Extensions/Extensions.ipc.js')
    default:
      throw new Error(`unknown module "${moduleId}"`)
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
  if (!state.pendingModules[moduleId]) {
    const importPromise = loadModule(moduleId)
    state.pendingModules[moduleId] = importPromise.then(initializeModule)
  }
  return state.pendingModules[moduleId]
}

const getModuleId = (commandId) => {
  switch (commandId) {
    case '001':
      return ModuleId.TestFramework
    case '002':
      return ModuleId.TestFrameworkComponent
    case 'Download.downloadFile':
    case 'Download.downloadJson':
      return ModuleId.Download
    case 'ExtensionHost.startWebExtensionHost':
    case 'ExtensionHost.loadWebExtension':
      return ModuleId.ExtensionHostCode
    case 'ExtensionMeta.addExtension':
    case 'ExtensionMeta.addWebExtension':
    case 'ExtensionMeta.addNodeExtension':
      return ModuleId.ExtensionMeta
    case 'Extensions.openExtensionsFolder':
    case 'Extensions.openCachedExtensionsFolder':
      return ModuleId.Extensions
    case 'Test.execute':
      return ModuleId.Test
    case 'ColorThemeFromJson.createColorThemeFromJson':
      return ModuleId.ColorThemeFromJson
    case 'ClipBoard.readText':
    case 'ClipBoard.writeText':
    case 'ClipBoard.writeNativeFiles':
    case 'ClipBoard.readNativeFiles':
      return ModuleId.ClipBoard
    case 'Ajax.getJson':
    case 'Ajax.getText':
      return ModuleId.Ajax
    case 'ErrorHandling.handleError':
      return ModuleId.ErrorHandling
    case 'FileSystem.readFile':
    case 'FileSystem.remove':
    case 'FileSystem.readDirWithFileTypes':
    case 'FileSystem.writeFile':
    case 'FileSystem.mkdir':
    case 'FileSystem.getPathSeparator':
      return ModuleId.FileSystem
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
      return ModuleId.Developer
    case 'Notification.create':
    case 'Notification.dispose':
    case 'Notification.showWithOptions':
    case 'Notification.handleClick':
      return ModuleId.Notification
    case 'ContextMenu.select':
    case 'ContextMenu.ModuleId.Window':
    case 'ContextMenu.hide':
    case 'ContextMenu.focusFirst':
      ModuleId.ContextMenu
    case 'ContextMenu.focusLast':
    case 'ContextMenu.ModuleId.Layout':
    case 'ContextMenu.focusPrevious':
    case 'ContextMenu.ModuleId.Viewlet':
    case 'ContextMenu.noop':
      return ModuleId.Workbench
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
      return ModuleId.Layout
    case 'Preferences.openSettingsJson':
    case 'Preferences.openKeyBindingsJson':
    case 'Preferences.hydrate':
      return ModuleId.Preferences
    case 'Open.openNativeFolder':
    case 'Open.openUrl':
      return ModuleId.Open
    case 'ColorPicker.open':
    case 'ColorPicker.close':
      return ModuleId.ColorPicker
    case 'KeyBindings.handleKeyBinding':
    case 'KeyBindings.hydrate':
      return ModuleId.KeyBindings
    case 'Dialog.close':
    case 'Dialog.handleClick':
    case 'Dialog.openFile':
    case 'Dialog.openFolder':
    case 'Dialog.showAbout':
    case 'Dialog.showMessage':
      return ModuleId.Dialog
    case 2133:
    case 'Viewlet.getAllStates':
    case 'Viewlet.openWidget':
      return ModuleId.Viewlet
    case 'IconTheme.getIconThemeCss':
    case 'IconTheme.hydrate':
    case 'IconTheme.addIcons':
      return ModuleId.IconTheme
    case 'EditorRename.open':
    case 'EditorRename.finish':
    case 'EditorRename.abort':
      return ModuleId.EditorRename
    case 'Format.hydrate':
      return ModuleId.Format
    case 3444:
      return ModuleId.Listener
    case 3900:
      return ModuleId.EditorError
    case 'Blob.base64StringToBlob':
      return ModuleId.Blob
    case 'Audio.playBell':
      return ModuleId.Audio
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
      return ModuleId.TitleBarMenu
    case 'RecentlyOpened.getRecentlyOpened':
    case 'RecentlyOpened.clearRecentlyOpened':
    case 'RecentlyOpened.addToRecentlyOpened':
    case 'RecentlyOpened.hydrate':
      return ModuleId.RecentlyOpened
    case 'ColorTheme.hydrate':
    case 'ColorTheme.setColorTheme':
      return ModuleId.ColorTheme

    // TODO this should be in layout module
    case 'Navigation.focusPreviousPart':
    case 'Navigation.focusNextPart':
    case 'Navigation.focusActivityBar':
    case 'Navigation.focusStatusBar':
    case 'Navigation.focusPanel':
    case 'Navigation.focusSideBar':
    case 'Navigation.focusTitleBar':
    case 'Navigation.focusMain':
      return ModuleId.Navigatiom
    case 'ServiceWorker.hydrate':
    case 'ServiceWorker.uninstall':
      return ModuleId.ServiceWorker
    case 'SaveState.hydrate':
    case 'SaveState.handleVisibilityChange':
      return ModuleId.SaveState
    case 'SessionStorage.clear':
    case 'SessionStorage.getJson':
      return ModuleId.SessionStorage
    case 'CacheStorage.clearCache':
    case 'CacheStorage.setJson':
    case 'CacheStorage.getJson':
      return ModuleId.CacheStorage
    case 'LocalStorage.clear':
    case 'LocalStorage.setJson':
    case 'LocalStorage.getJson':
    case 'LocalStorage.getText':
    case 'LocalStorage.setText':
    case 'LocalStorage.getItem':
      return ModuleId.LocalStorage
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
      return ModuleId.Menu
    case 'Workspace.setPath':
    case 'Workspace.hydrate':
    case 'Workspace.setUri':
      return ModuleId.Workspace
    case 'Base64.decode':
      return ModuleId.Base64
    case 'Window.reload':
    case 'Window.minimize':
    case 'Window.maximize':
    case 'Window.unmaximize':
    case 'Window.close':
    case 'Window.makeScreenshot':
    case 'Window.openNew':
    case 'Window.exit':
      return ModuleId.Window
    case 'EditorDiagnostics.hydrate':
      return ModuleId.EditorDiagnostics
    case 'KeyBindingsInitial.getKeyBindings':
      return ModuleId.KeyBindingsInitial
    case 'ImagePreview.show':
    case 'ImagePreview.hide':
      return ModuleId.ImagePreview
    case 'Callback.resolve':
    case 'Callback.reject':
      return ModuleId.Callback
    case 'QuickPick.selectCurrentIndex':
    case 'QuickPick.handleInput':
    case 'QuickPick.selectIndex':
    case 'QuickPick.focusFirst':
    case 'QuickPick.focusLast':
    case 'QuickPick.focusPrevious':
    case 'QuickPick.focusNext':
    case 'QuickPick.handleBlur':
      return ModuleId.ViewletQuickPick
    case 'FindWidget.create':
    case 'FindWidget.dispose':
    case 'FindWidget.setValue':
      return ModuleId.FindWidget
    case 'SessionReplay.downloadSession':
    case 'SessionReplay.replaySession':
    case 'SessionReplay.replayCurrentSession':
    case 'SessionReplay.openSession':
      return ModuleId.SessionReplay
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
