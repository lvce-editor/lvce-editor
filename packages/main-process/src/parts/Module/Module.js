const ModuleId = require('../ModuleId/ModuleId.js')

exports.load = async (moduleId) => {
  switch (moduleId) {
    case ModuleId.App:
      return require('../App/App.ipc.js')
    case ModuleId.AppWindow:
      return require('../AppWindow/AppWindow.ipc.js')
    case ModuleId.Beep:
      return require('../ElectronBeep/ElectronBeep.js')
    case ModuleId.Developer:
      return require('../ElectronDeveloper/ElectronDeveloper.ipc.js')
    case ModuleId.Dialog:
      return require('../ElectronDialog/ElectronDialog.ipc.js')
    case ModuleId.ElectronWindowAbout:
      return require('../ElectronWindowAbout/ElectronWindowAbout.ipc.js')
    case ModuleId.ElectronWindowProcessExplorer:
      return require('../ElectronWindowProcessExplorer/ElectronWindowProcessExplorer.ipc.js')
    case ModuleId.Window:
      return require('../ElectronWindow/ElectronWindow.ipc.js')
    case ModuleId.ElectronShell:
      return require('../ElectronShell/ElectronShell.ipc.js')
    case ModuleId.ElectronPowerSaveBlocker:
      return require('../ElectronPowerSaveBlocker/ElectronPowerSaveBlocker.ipc.js')
    case ModuleId.ElectronSafeStorage:
      return require('../ElectronSafeStorage/ElectronSafeStorage.ipc.js')
    case ModuleId.ElectronContentTracing:
      return require('../ElectronContentTracing/ElectronContentTracing.ipc.js')
    case ModuleId.ElectronNetLog:
      return require('../ElectronNetLog/ElectronNetLog.ipc.js')
    default:
      throw new Error('unknown module')
  }
}
