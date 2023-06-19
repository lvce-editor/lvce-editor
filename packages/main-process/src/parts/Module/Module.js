const ModuleId = require('../ModuleId/ModuleId.js')
const { ModuleNotFoundError } = require('../ModuleNotFoundError/ModuleNotFoundError.js')

exports.load = async (moduleId) => {
  switch (moduleId) {
    case ModuleId.About:
      return require('../About/About.ipc.js')
    case ModuleId.App:
      return require('../App/App.ipc.js')
    case ModuleId.AppWindow:
      return require('../AppWindow/AppWindow.ipc.js')
    case ModuleId.ElectronApplicationMenu:
      return require('../ElectronApplicationMenu/ElectronApplicationMenu.ipc.js')
    case ModuleId.Beep:
      return require('../ElectronBeep/ElectronBeep.js')
    case ModuleId.ElectronBrowserView:
      return require('../ElectronBrowserView/ElectronBrowserView.ipc.js')
    case ModuleId.ElectronBrowserViewFunctions:
      return require('../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.ipc.js')
    case ModuleId.ElectronBrowserViewQuickPick:
      return require('../ElectronBrowserViewQuickPick/ElectronBrowserViewQuickPick.ipc.js')
    case ModuleId.ElectronBrowserViewSuggestions:
      return require('../ElectronBrowserViewSuggestions/ElectronBrowserViewSuggestions.ipc.js')
    case ModuleId.ElectronClipBoard:
      return require('../ElectronClipBoard/ElectronClipBoard.ipc.js')
    case ModuleId.ElectronContentTracing:
      return require('../ElectronContentTracing/ElectronContentTracing.ipc.js')
    case ModuleId.ElectronContextMenu:
      return require('../ElectronContextMenu/ElectronContextMenu.ipc.js')
    case ModuleId.Developer:
      return require('../ElectronDeveloper/ElectronDeveloper.ipc.js')
    case ModuleId.Dialog:
      return require('../ElectronDialog/ElectronDialog.ipc.js')
    case ModuleId.ElectronNet:
      return require('../ElectronNet/ElectronNet.ipc.js')
    case ModuleId.ElectronNetLog:
      return require('../ElectronNetLog/ElectronNetLog.ipc.js')
    case ModuleId.ElectronPowerSaveBlocker:
      return require('../ElectronPowerSaveBlocker/ElectronPowerSaveBlocker.ipc.js')
    case ModuleId.ElectronSafeStorage:
      return require('../ElectronSafeStorage/ElectronSafeStorage.ipc.js')
    case ModuleId.ElectronShell:
      return require('../ElectronShell/ElectronShell.ipc.js')
    case ModuleId.Window:
      return require('../ElectronWindow/ElectronWindow.ipc.js')
    case ModuleId.ElectronWindowProcessExplorer:
      return require('../ElectronWindowProcessExplorer/ElectronWindowProcessExplorer.ipc.js')
    case ModuleId.Process:
      return require('../Process/Process.ipc.js')
    case ModuleId.CreatePidMap:
      return require('../CreatePidMap/CreatePidMap.ipc.js')
    case ModuleId.Beep:
      return require('../Beep/Beep.ipc.js')
    case ModuleId.OpenExternal:
      return require('../OpenExternal/OpenExternal.ipc.js')
    default:
      throw new ModuleNotFoundError(moduleId)
  }
}
