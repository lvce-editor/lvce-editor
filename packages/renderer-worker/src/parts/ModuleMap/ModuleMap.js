import * as ModuleId from '../ModuleId/ModuleId.js'

const getPrefix = (commandId) => {
  if (!commandId || typeof commandId !== 'string') {
    return commandId
  }
  return commandId.slice(0, commandId.indexOf('.'))
}

export const getModuleId = (commandId) => {
  const prefix = getPrefix(commandId)
  switch (prefix) {
    // TODO this should be in layout module
    case 'About':
      return ModuleId.About
    case 'Ajax':
      return ModuleId.Ajax
    case 'Audio':
      return ModuleId.Audio
    case 'Base64':
      return ModuleId.Base64
    case 'Blob':
      return ModuleId.Blob
    case 'CacheStorage':
      return ModuleId.CacheStorage
    case 'Callback':
      return ModuleId.Callback
    case 'Chrome':
      return ModuleId.Chrome
    case 'ChromeExtension':
      return ModuleId.ChromeExtension
    case 'ClipBoard':
      return ModuleId.ClipBoard
    case 'ColorPicker':
      return ModuleId.ColorPicker
    case 'ColorTheme':
      return ModuleId.ColorTheme
    case 'ColorThemeFromJson':
      return ModuleId.ColorThemeFromJson
    case 'ContentTracing':
      return ModuleId.ContentTracing
    case 'ContextMenu':
      return ModuleId.ContextMenu
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
    case 'EditorRename':
      return ModuleId.EditorRename
    case 'ElectronApp':
      return ModuleId.ElectronApp
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
    case 'IconTheme':
      return ModuleId.IconTheme
    case 'ImagePreview':
      return ModuleId.ImagePreview
    case 'IndexedDb':
      return ModuleId.IndexedDb
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
    case 'Navigation':
      return ModuleId.Navigatiom
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
    case 'RecentlyOpened':
      return ModuleId.RecentlyOpened
    case 'SaveFileAs':
      return ModuleId.SaveFileAs
    case 'SaveState':
      return ModuleId.SaveState
    case 'ServiceWorker':
      return ModuleId.ServiceWorker
    case 'SessionReplay':
      return ModuleId.SessionReplay
    case 'SessionStorage':
      return ModuleId.SessionStorage
    case 'Test':
      return ModuleId.Test
    case '001':
      return ModuleId.TestFramework
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
    case 'ElectronProcessCrash':
      return ModuleId.ElectronProcessCrash
    case 'SharedProcessCrash':
      return ModuleId.SharedProcessCrash
    default:
      throw new Error(`command ${commandId} not found`)
  }
}
