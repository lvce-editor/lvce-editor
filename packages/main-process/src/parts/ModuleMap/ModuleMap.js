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
    case 'ElectronShell.beep':
    case 'ElectronShell.showItemInFolder':
      return ModuleId.ElectronShell
    case 'ElectronPowerSaveBlocker.start':
    case 'ElectronPowerSaveBlocker.stop':
      return ModuleId.ElectronPowerSaveBlocker
    case 'ElectronSafeStorage.isEncryptionAvailable':
    case 'ElectronSafeStorage.encryptString':
    case 'ElectronSafeStorage.decryptString':
      return ModuleId.ElectronSafeStorage
    default:
      throw new Error(`method not found ${commandId}`)
  }
}
