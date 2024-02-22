import * as ModuleId from '../ModuleId/ModuleId.js'
import { ModuleNotFoundError } from '../ModuleNotFoundError/ModuleNotFoundError.js'

export const load = async (moduleId) => {
  switch (moduleId) {
    case ModuleId.App:
      return import('../App/App.ipc.js')
    case ModuleId.AppWindow:
      return import('../AppWindow/AppWindow.ipc.js')
    case ModuleId.Beep:
      return import('../Beep/Beep.ipc.js')
    case ModuleId.Crash:
      return import('../Crash/Crash.ipc.js')
    case ModuleId.CreatePidMap:
      return import('../CreatePidMap/CreatePidMap.ipc.js')
    case ModuleId.DesktopCapturer:
      return import('../DesktopCapturer/DesktopCapturer.ipc.js')
    case ModuleId.ElectronApplicationMenu:
      return import('../ElectronApplicationMenu/ElectronApplicationMenu.ipc.js')
    case ModuleId.Beep:
      return import('../ElectronBeep/ElectronBeep.js')
    case ModuleId.ElectronBrowserView:
      return import('../ElectronBrowserView/ElectronBrowserView.ipc.js')
    case ModuleId.ElectronBrowserViewFunctions:
      return import('../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.ipc.js')
    case ModuleId.ElectronBrowserViewQuickPick:
      return import('../ElectronBrowserViewQuickPick/ElectronBrowserViewQuickPick.ipc.js')
    case ModuleId.ElectronBrowserViewSuggestions:
      return import('../ElectronBrowserViewSuggestions/ElectronBrowserViewSuggestions.ipc.js')
    case ModuleId.ElectronClipBoard:
      return import('../ElectronClipBoard/ElectronClipBoard.ipc.js')
    case ModuleId.ElectronContentTracing:
      return import('../ElectronContentTracing/ElectronContentTracing.ipc.js')
    case ModuleId.ElectronContextMenu:
      return import('../ElectronContextMenu/ElectronContextMenu.ipc.js')
    case ModuleId.Developer:
      return import('../ElectronDeveloper/ElectronDeveloper.ipc.js')
    case ModuleId.Dialog:
      return import('../ElectronDialog/ElectronDialog.ipc.js')
    case ModuleId.ElectronNet:
      return import('../ElectronNet/ElectronNet.ipc.js')
    case ModuleId.ElectronNetLog:
      return import('../ElectronNetLog/ElectronNetLog.ipc.js')
    case ModuleId.ElectronPowerSaveBlocker:
      return import('../ElectronPowerSaveBlocker/ElectronPowerSaveBlocker.ipc.js')
    case ModuleId.ElectronSafeStorage:
      return import('../ElectronSafeStorage/ElectronSafeStorage.ipc.js')
    case ModuleId.ElectronShell:
      return import('../ElectronShell/ElectronShell.ipc.js')
    case ModuleId.Window:
      return import('../ElectronWindow/ElectronWindow.ipc.js')
    case ModuleId.ElectronWindowProcessExplorer:
      return import('../ElectronWindowProcessExplorer/ElectronWindowProcessExplorer.ipc.js')
    case ModuleId.IpcParent:
      return import('../IpcParent/IpcParent.ipc.js')
    case ModuleId.OpenExternal:
      return import('../OpenExternal/OpenExternal.ipc.js')
    case ModuleId.Process:
      return import('../Process/Process.ipc.js')
    case ModuleId.Trash:
      return import('../Trash/Trash.ipc.js')
    case ModuleId.Exit:
      return import('../Exit/Exit.ipc.js')
    case ModuleId.ElectronScreen:
      return import('../ElectronScreen/ElectronScreen.ipc.js')
    case ModuleId.TemporaryMessagePort:
      return import('../TemporaryMessagePort/TemporaryMessagePort.ipc.js')
    case ModuleId.ElectronWebContents:
      return import('../ElectronWebContents/ElectronWebContents.ipc.js')
    case ModuleId.ElectronWebContentsView:
      return import('../ElectronWebContentsView/ElectronWebContentsView.ipc.js')
    case ModuleId.ElectronWebContentsViewFunctions:
      return import('../ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.ipc.js')
    default:
      throw new ModuleNotFoundError(moduleId)
  }
}
