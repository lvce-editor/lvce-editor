import * as ModuleId from '../ModuleId/ModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    case ModuleId.AttachDebugger:
      return import('../AttachDebugger/AttachDebugger.ipc.js')
    case ModuleId.AutoUpdater:
      return import('../AutoUpdater/AutoUpdater.ipc.js')
    case ModuleId.AutoUpdaterAppImage:
      return import('../AutoUpdaterAppImage/AutoUpdaterAppImage.ipc.js')
    case ModuleId.AutoUpdaterWindowsNsis:
      return import('../AutoUpdaterWindowsNsis/AutoUpdaterWindowsNsis.ipc.js')
    case ModuleId.BulkReplacement:
      return import('../BulkReplacement/BulkReplacement.ipc.js')
    case ModuleId.ChromeExtension:
      return import('../ChromeExtension/ChromeExtension.ipc.js')
    case ModuleId.ClipBoard:
      return import('../ClipBoard/ClipBoard.ipc.js')
    case ModuleId.Developer:
      return import('../Developer/Developer.ipc.js')
    case ModuleId.Download:
      return import('../Download/Download.ipc.js')
    case ModuleId.ElectronInitialize:
      return import('../ElectronInitialize/ElectronInitialize.ipc.js')
    case ModuleId.ExtensionHost:
      return import('../ExtensionHost/ExtensionHost.ipc.js')
    case ModuleId.ExtensionManagement:
      return import('../ExtensionManagement/ExtensionManagement.ipc.js')
    case ModuleId.FileSystem:
      return import('../FileSystem/FileSystem.ipc.js')
    case ModuleId.GetTerminalSpawnOptions:
      return import('../GetTerminalSpawnOptions/GetTerminalSpawnOptions.ipc.js')
    case ModuleId.GitLsFiles:
      return import('../GitLsFiles/GitLsFiles.ipc.js')
    case ModuleId.HandleCliArgs:
      return import('../HandleCliArgs/HandleCliArgs.ipc.js')
    case ModuleId.HandleElectronMessagePort:
      return import('../HandleElectronMessagePort/HandleElectronMessagePort.ipc.js')
    case ModuleId.HandleNodeMessagePort:
      return import('../HandleNodeMessagePort/HandleNodeMessagePort.ipc.js')
    case ModuleId.HandleWebSocket:
      return import('../HandleWebSocket/HandleWebSocket.ipc.js')
    case ModuleId.IncrementalTextSearch:
      return import('../IncrementalTextSearch/IncremetalTextSearch.ipc.js')
    case ModuleId.InstallExtension:
      return import('../InstallExtension/InstallExtension.ipc.js')
    case ModuleId.IsAutoUpdateSupported:
      return import('../IsAutoUpdateSupported/IsAutoUpdateSupported.ipc.js')
    case ModuleId.ListProcessesWithMemoryUsage:
      return import('../ListProcessesWithMemoryUsage/ListProcessesWithMemoryUsage.ipc.js')
    case ModuleId.OpenNativeFolder:
      return import('../OpenNativeFolder/OpenNativeFolder.ipc.js')
    case ModuleId.OutputChannel:
      return import('../OutputChannel/OutputChannel.ipc.js')
    case ModuleId.Platform:
      return import('../Platform/Platform.ipc.js')
    case ModuleId.Preferences:
      return import('../Preferences/Preferences.ipc.js')
    case ModuleId.Process:
      return import('../Process/Process.ipc.js')
    case ModuleId.RebuildNodePty:
      return import('../RebuildNodePty/RebuildNodePty.ipc.js')
    case ModuleId.RecentlyOpened:
      return import('../RecentlyOpened/RecentlyOpened.ipc.js')
    case ModuleId.SearchFile:
      return import('../SearchFile/SearchFile.ipc.js')
    case ModuleId.Terminal:
      return import('../Terminal/Terminal.ipc.js')
    case ModuleId.TextDocument:
      return import('../TextDocument/TextDocument.ipc.js')
    case ModuleId.Search:
      return import('../TextSearch/TextSearch.ipc.js')
    case ModuleId.WebSocketServer:
      return import('../WebSocketServer/WebSocketServer.ipc.js')
    case ModuleId.Workspace:
      return import('../Workspace/Workspace.ipc.js')
    case ModuleId.Performance:
      return import('../Performance/Performance.ipc.js')
    case ModuleId.Window:
      return import('../Window/Window.ipc.js')
    default:
      throw new Error(`module ${moduleId} not found`)
  }
}
