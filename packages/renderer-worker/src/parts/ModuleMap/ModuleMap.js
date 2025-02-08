import * as Character from '../Character/Character.js'
import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as ModuleId from '../ModuleId/ModuleId.js'

const getPrefix = (commandId) => {
  if (!commandId || typeof commandId !== 'string') {
    return commandId
  }
  const dotIndex = commandId.indexOf(Character.Dot)
  if (dotIndex === -1) {
    return ''
  }
  return commandId.slice(0, dotIndex)
}

export const getModuleId = (commandId) => {
  const prefix = getPrefix(commandId)
  if (!prefix) {
    throw new CommandNotFoundError(commandId)
  }
  switch (prefix) {
    case 'About':
      return ModuleId.About
    case 'Ajax':
      return ModuleId.Ajax
    case 'Audio':
      return ModuleId.Audio
    case 'Debug':
      return ModuleId.Debug
    case 'AutoUpdater':
      return ModuleId.AutoUpdater
    case 'Blob':
      return ModuleId.Blob
    case 'BulkReplacement':
      return ModuleId.BulkReplacement
    case 'CacheStorage':
      return ModuleId.CacheStorage
    case 'Callback':
      return ModuleId.Callback
    case 'Chrome':
      return ModuleId.Chrome
    case 'ClipBoard':
      return ModuleId.ClipBoard
    case 'ColorTheme':
      return ModuleId.ColorTheme
    case 'ConfirmPrompt':
      return ModuleId.ConfirmPrompt
    case 'ContentTracing':
      return ModuleId.ContentTracing
    case 'ContextMenu':
      return ModuleId.ContextMenu
    case 'DebugSharedProcess':
      return ModuleId.DebugSharedProcess
    case 'Developer':
      return ModuleId.Developer
    case 'Dialog':
      return ModuleId.Dialog
    case 'Download':
      return ModuleId.Download
    case 'EditorDiagnostics':
      return ModuleId.EditorDiagnostics
    case 3900:
      return ModuleId.EditorError
    case 'ElectronApplicationMenu':
      return ModuleId.ElectronApplicationMenu
    case 'ElectronBrowserView':
      return ModuleId.ElectronBrowserView
    case 'ElectronClipBoard':
      return ModuleId.ElectronClipBoard
    case 'ElectronContextMenu':
      return ModuleId.ElectronContextMenu
    case 'ElectronWindow':
      return ModuleId.ElectronWindow
    case 'ErrorHandling':
      return ModuleId.ErrorHandling
    case 'Eval':
      return ModuleId.Eval
    case 'Exit':
      return ModuleId.Exit
    case 'ExtensionHost':
      return ModuleId.ExtensionHostCode
    case 'ExtensionMeta':
      return ModuleId.ExtensionMeta
    case 'Extensions':
      return ModuleId.Extensions
    case 'FilePicker':
      return ModuleId.FilePicker
    case 'FileSystem':
      return ModuleId.FileSystem
    case 'Format':
      return ModuleId.Format
    case 'Focus':
      return ModuleId.Focus
    case 'IconTheme':
      return ModuleId.IconTheme
    case 'ImagePreview':
      return ModuleId.ImagePreview
    case 'IncrementalTextSearch':
      return ModuleId.IncrementalTextSearch
    case 'IndexedDb':
      return ModuleId.IndexedDb
    case 'IpcParent':
      return ModuleId.IpcParent
    case 'KeyBindings':
      return ModuleId.KeyBindings
    case 'KeyBindingsInitial':
      return ModuleId.KeyBindingsInitial
    case 3444:
      return ModuleId.Listener
    case 'LocalStorage':
      return ModuleId.LocalStorage
    case 'Menu':
      return ModuleId.Menu
    case 'Mime':
      return ModuleId.Mime
    case 'NativeHost':
      return ModuleId.NativeHost
    case 'Navigation':
      return ModuleId.Navigation
    case 'Notification':
      return ModuleId.Notification
    case 'Open':
      return ModuleId.Open
    case 'OpenNativeFolder':
      return ModuleId.OpenNativeFolder
    case 'PersistentFileHandle':
      return ModuleId.PersistentFileHandle
    case 'Preferences':
      return ModuleId.Preferences
    case 'Prompt':
      return ModuleId.Prompt
    case 'QuickPick':
      return ModuleId.QuickPick
    case 'RebuildNodePty':
      return ModuleId.RebuildNodePty
    case 'RecentlyOpened':
      return ModuleId.RecentlyOpened
    case 'Reload':
      return ModuleId.Reload
    case 'SaveFileAs':
      return ModuleId.SaveFileAs
    case 'SaveState':
      return ModuleId.SaveState
    case 'SessionReplay':
      return ModuleId.SessionReplay
    case 'SessionStorage':
      return ModuleId.SessionStorage
    case 'Test':
      return ModuleId.Test
    case '002':
      return ModuleId.TestFrameworkComponent
    case 'Url':
      return ModuleId.Url
    case 'Viewlet':
    case 2133:
      return ModuleId.Viewlet
    case 'Window':
      return ModuleId.Window
    case 'Workbench':
      return ModuleId.Workbench
    case 'Workspace':
      return ModuleId.Workspace
    case 'WindowTitle':
      return ModuleId.WindowTitle
    case 'PointerCapture':
      return ModuleId.PointerCapture
    case 'ExtensionHostQuickPick':
      return ModuleId.ExtensionHostQuickPick
    case 'ExtensionHostDialog':
      return ModuleId.ExtensionHostDialog
    case 'ExtensionHostDefinition':
      return ModuleId.ExtensionHostDefinition
    case 'TestFrameWork':
      return ModuleId.TestFrameWork
    case 'ExtensionHostWorkerContentSecurityPolicy':
      return ModuleId.ExtensionHostWorkerContentSecurityPolicy
    case 'SendMessagePortToElectron':
      return ModuleId.SendMessagePortToElectron
    case 'ExtensionHostBraceCompletion':
      return ModuleId.ExtensionHostBraceCompletion
    case 'OffscreenCanvas':
      return ModuleId.OffscreenCanvas
    case 'Languages':
      return ModuleId.Languages
    case 'FileWatcher':
      return ModuleId.FileWatcher
    case 'ExtensionHostTypeDefinition':
      return ModuleId.ExtensionHostTypeDefinition
    case 'ExtensionHostSelection':
      return ModuleId.ExtensionHostSelection
    case 'ExtensionHostOrganizeImports':
      return ModuleId.ExtensionHostOrganizeImports
    case 'ExtensionHostTabCompletion':
      return ModuleId.ExtensionHostTabCompletion
    case 'ExtensionHostClosingTagCompletion':
      return ModuleId.ExtensionHostClosingTag
    case 'SendMessagePortToRendererProcess':
      return ModuleId.SendMessagePortToRendererProcess
    case 'ExtensionHostHover':
      return ModuleId.ExtensionHostHover
    case 'SendMessagePortToExtensionHostWorker':
      return ModuleId.SendMessagePortToExtensionHostWorker
    case 'SendMessagePortToSyntaxHighlightingWorker':
      return ModuleId.SendMessagePortToSyntaxHighlightingWorker
    case 'ExtensionHostManagement':
      return ModuleId.ExtensionHostManagement
    case 'Transferrable':
      return ModuleId.Transferrable
    case 'WebView':
      return ModuleId.WebView
    case 'SearchProcess':
      return ModuleId.SearchProcess
    case 'GetEditorSourceActions':
      return ModuleId.GetEditorSourceActions
    case 'ExtensionHostTextSearch':
      return ModuleId.ExtensionHostTextSearch
    case 'ExtensionStateStorage':
      return ModuleId.ExtensionStateStorage
    case 'GetWindowId':
      return ModuleId.GetWindowId
    case 'ElectronDialog':
      return ModuleId.ElectronDialog
    case 'Process':
      return ModuleId.Process
    case 'ExtensionManagement':
      return ModuleId.ExtensionManagement
    case 'Markdown':
      return ModuleId.Markdown
    default:
      throw new Error(`module ${prefix} not found`)
  }
}
