import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as ModuleId from '../ModuleId/ModuleId.js'

const getPrefix = (commandId) => {
  return commandId.slice(0, commandId.indexOf('.'))
}

export const getModuleId = (commandId) => {
  const prefix = getPrefix(commandId)
  switch (prefix) {
    case 'Crash':
      return ModuleId.Crash
    case 'ElectronApp':
    case 'App':
      return ModuleId.App
    case 'Beep':
      return ModuleId.Beep
    case 'ElectronWindow':
      return ModuleId.Window
    case 'ElectronDeveloper':
      return ModuleId.Developer
    case 'AppWindow':
      return ModuleId.AppWindow
    case 'ElectronWindowProcessExplorer':
      return ModuleId.ElectronWindowProcessExplorer
    case 'ElectronDialog':
      return ModuleId.Dialog
    case 'ElectronBeep':
      return ModuleId.Beep
    case 'ElectronShell':
      return ModuleId.ElectronShell
    case 'ElectronPowerSaveBlocker':
      return ModuleId.ElectronPowerSaveBlocker
    case 'ElectronSafeStorage':
      return ModuleId.ElectronSafeStorage
    case 'ElectronContentTracing':
      return ModuleId.ElectronContentTracing
    case 'ElectronNetLog':
      return ModuleId.ElectronNetLog
    case 'ElectronBrowserView':
      return ModuleId.ElectronBrowserView
    case 'ElectronBrowserViewQuickPick':
      return ModuleId.ElectronBrowserViewQuickPick
    case 'ElectronContextMenu':
      return ModuleId.ElectronContextMenu
    case 'ElectronClipBoard':
      return ModuleId.ElectronClipBoard
    case 'ElectronApplicationMenu':
      return ModuleId.ElectronApplicationMenu
    case 'Process':
      return ModuleId.Process
    case 'ElectronNet':
      return ModuleId.ElectronNet
    case 'ElectronBrowserViewSuggestions':
      return ModuleId.ElectronBrowserViewSuggestions
    case 'CreatePidMap':
      return ModuleId.CreatePidMap
    case 'OpenExternal':
      return ModuleId.OpenExternal
    case 'Process':
      return ModuleId.Process
    case 'Platform':
      return ModuleId.Platform
    case 'GetWindowId':
      return ModuleId.GetWindowId
    case 'DesktopCapturer':
      return ModuleId.DesktopCapturer
    case 'Trash':
      return ModuleId.Trash
    case 'IpcParent':
      return ModuleId.IpcParent
    case 'Exit':
      return ModuleId.Exit
    case 'ElectronScreen':
      return ModuleId.ElectronScreen
    case 'TemporaryMessagePort':
      return ModuleId.TemporaryMessagePort
    case 'ElectronWebContents':
      return ModuleId.ElectronWebContents
    case 'ElectronWebContentsView':
      return ModuleId.ElectronWebContentsView
    case 'ElectronWebContentsViewFunctions':
      return ModuleId.ElectronWebContentsViewFunctions
    default:
      throw new CommandNotFoundError(commandId)
  }
}
