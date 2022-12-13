import * as ModuleId from '../ModuleId/ModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    case ModuleId.ChromeExtension:
      return import('../ChromeExtension/ChromeExtension.ipc.js')
    case ModuleId.ClipBoard:
      return import('../ClipBoard/ClipBoard.ipc.js')
    case ModuleId.Developer:
      return import('../Developer/Developer.ipc.js')
    case ModuleId.Download:
      return import('../Download/Download.ipc.js')
    case ModuleId.ExtensionHost:
      return import('../ExtensionHost/ExtensionHost.ipc.js')
    case ModuleId.ExtensionManagement:
      return import('../ExtensionManagement/ExtensionManagement.ipc.js')
    case ModuleId.FileSystem:
      return import('../FileSystem/FileSystem.ipc.js')
    case ModuleId.GitLsFiles:
      return import('../GitLsFiles/GitLsFiles.ipc.js')
    case ModuleId.Native:
      return import('../Native/Native.ipc.js')
    case ModuleId.OutputChannel:
      return import('../OutputChannel/OutputChannel.ipc.js')
    case ModuleId.Platform:
      return import('../Platform/Platform.ipc.js')
    case ModuleId.Preferences:
      return import('../Preferences/Preferences.ipc.js')
    case ModuleId.RecentlyOpened:
      return import('../RecentlyOpened/RecentlyOpened.ipc.js')
    case ModuleId.Search:
      return import('../TextSearch/TextSearch.ipc.js')
    case ModuleId.SearchFile:
      return import('../SearchFile/SearchFile.ipc.js')
    case ModuleId.Terminal:
      return import('../Terminal/Terminal.ipc.js')
    case ModuleId.TextDocument:
      return import('../TextDocument/TextDocument.ipc.js')
    case ModuleId.WebSocketServer:
      return import('../WebSocketServer/WebSocketServer.ipc.js')
    case ModuleId.Workspace:
      return import('../Workspace/Workspace.ipc.js')
    default:
      throw new Error(`module ${moduleId} not found`)
  }
}
