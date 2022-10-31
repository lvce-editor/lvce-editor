const ModuleId = require('../ModuleId/ModuleId.js')

exports.getModuleId = (commandId) => {
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
    case 'ElectronWindow.zoomIn':
    case 'ElectronWindow.zoomOut':
    case 'ElectronWindow.focus':
      return ModuleId.Window
    case 'ElectronDeveloper.getPerformanceEntries':
    case 'ElectronDeveloper.crashMainProcess':
      return ModuleId.Developer
    case 'AppWindow.createAppWindow':
    case 'AppWindow.openNew':
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
    case 'ElectronShell.beep':
    case 'ElectronShell.showItemInFolder':
    case 'ElectronShell.openExternal':
      return ModuleId.ElectronShell
    case 'ElectronPowerSaveBlocker.start':
    case 'ElectronPowerSaveBlocker.stop':
      return ModuleId.ElectronPowerSaveBlocker
    case 'ElectronSafeStorage.isEncryptionAvailable':
    case 'ElectronSafeStorage.encryptString':
    case 'ElectronSafeStorage.decryptString':
      return ModuleId.ElectronSafeStorage
    case 'ElectronContentTracing.startRecording':
    case 'ElectronContentTracing.stopRecording':
      return ModuleId.ElectronContentTracing
    case 'ElectronNetLog.startLogging':
    case 'ElectronNetLog.stopLogging':
      return ModuleId.ElectronNetLog
    case 'ElectronBrowserView.createBrowserView':
    case 'ElectronBrowserView.disposeBrowserView':
      return ModuleId.ElectronBrowserView
    case 'ElectronBrowserViewQuickPick.createBrowserViewQuickPick':
    case 'ElectronBrowserViewQuickPick.disposeBrowserViewQuickPick':
      return ModuleId.ElectronBrowserViewQuickPick
    case 'ElectronBrowserViewFunctions.resizeBrowserView':
    case 'ElectronBrowserViewFunctions.disposeBrowserView':
    case 'ElectronBrowserViewFunctions.setIframeSrc':
    case 'ElectronBrowserViewFunctions.openDevtools':
    case 'ElectronBrowserViewFunctions.forward':
    case 'ElectronBrowserViewFunctions.reload':
    case 'ElectronBrowserViewFunctions.backward':
    case 'ElectronBrowserViewFunctions.focus':
    case 'ElectronBrowserViewFunctions.show':
    case 'ElectronBrowserViewFunctions.hide':
      return ModuleId.ElectronBrowserViewFunctions
    default:
      throw new Error(`method not found ${commandId}`)
  }
}
