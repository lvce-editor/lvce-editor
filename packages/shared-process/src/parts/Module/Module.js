import * as ModuleId from '../ModuleId/ModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    case ModuleId.AttachDebugger:
      return import('../AttachDebugger/AttachDebugger.ipc.js')
    case ModuleId.AutoUpdater:
      return import('../AutoUpdater/AutoUpdater.ipc.js')
    case ModuleId.AutoUpdaterAppImage:
      return import('../AutoUpdaterAppImage/AutoUpdaterAppImage.ipc.js')
    case ModuleId.GetWindowId:
      return import('../GetWindowId/GetWindowId.ipc.js')
    case ModuleId.AutoUpdaterWindowsNsis:
      return import('../AutoUpdaterWindowsNsis/AutoUpdaterWindowsNsis.ipc.js')
    case ModuleId.BulkReplacement:
      return import('../BulkReplacement/BulkReplacement.ipc.js')
    case ModuleId.ClipBoard:
      return import('../ClipBoard/ClipBoard.ipc.js')
    case ModuleId.Crash:
      return import('../Crash/Crash.ipc.js')
    case ModuleId.DesktopCapturer:
      return import('../DesktopCapturer/DesktopCapturer.ipc.js')
    case ModuleId.Developer:
      return import('../Developer/Developer.ipc.js')
    case ModuleId.Download:
      return import('../Download/Download.ipc.js')
    case ModuleId.ElectronApplicationMenu:
      return import('../ElectronApplicationMenu/ElectronApplicationMenu.ipc.js')
    case ModuleId.ElectronContentTracing:
      return import('../ElectronContentTracing/ElectronContentTracing.ipc.js')
    case ModuleId.ElectronDeveloper:
      return import('../ElectronDeveloper/ElectronDeveloper.ipc.js')
    case ModuleId.ElectronContextMenu:
      return import('../ElectronContextMenu/ElectronContextMenu.ipc.js')
    case ModuleId.ElectronDialog:
      return import('../ElectronDialog/ElectronDialog.ipc.js')
    case ModuleId.ElectronInitialize:
      return import('../ElectronInitialize/ElectronInitialize.ipc.js')
    case ModuleId.ElectronNetLog:
      return import('../ElectronNetLog/ElectronNetLog.ipc.js')
    case ModuleId.ElectronProcess:
      return import('../ElectronProcess/ElectronProcess.ipc.js')
    case ModuleId.ElectronSafeStorage:
      return import('../ElectronSafeStorage/ElectronSafeStorage.ipc.js')
    case ModuleId.Window:
      return import('../ElectronWindow/ElectronWindow.ipc.js')
    case ModuleId.ElectronWindowAbout:
      return import('../ElectronWindowAbout/ElectronWindowAbout.ipc.js')
    case ModuleId.ElectronWindowProcessExplorer:
      return import('../ElectronWindowProcessExplorer/ElectronWindowProcessExplorer.ipc.js')
    case ModuleId.Exit:
      return import('../Exit/Exit.ipc.js')
    case ModuleId.HandleRequestTest:
      return import('../HandleRequestTest/HandleRequestTest.ipc.js')
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
    case ModuleId.InstallExtension:
      return import('../InstallExtension/InstallExtension.ipc.js')
    case ModuleId.IsAutoUpdateSupported:
      return import('../IsAutoUpdateSupported/IsAutoUpdateSupported.ipc.js')
    case ModuleId.OpenExternal:
      return import('../OpenExternal/OpenExternal.ipc.js')
    case ModuleId.OpenNativeFolder:
      return import('../OpenNativeFolder/OpenNativeFolder.ipc.js')
    case ModuleId.ElectronPowerSaveBlocker:
      return import('../ElectronPowerSaveBlocker/ElectronPowerSaveBlocker.ipc.js')
    case ModuleId.Os:
      return import('../Os/Os.ipc.js')
    case ModuleId.OutputChannel:
      return import('../OutputChannel/OutputChannel.ipc.js')
    case ModuleId.Performance:
      return import('../Performance/Performance.ipc.js')
    case ModuleId.Platform:
      return import('../Platform/Platform.ipc.js')
    case ModuleId.Preferences:
      return import('../Preferences/Preferences.ipc.js')
    case ModuleId.Process:
      return import('../Process/Process.ipc.js')
    case ModuleId.ProcessId:
      return import('../ProcessId/ProcessId.ipc.js')
    case ModuleId.RebuildNodePty:
      return import('../RebuildNodePty/RebuildNodePty.ipc.js')
    case ModuleId.RecentlyOpened:
      return import('../RecentlyOpened/RecentlyOpened.ipc.js')
    case ModuleId.Terminal:
      return import('../Terminal/Terminal.ipc.js')
    case ModuleId.TextDocument:
      return import('../TextDocument/TextDocument.ipc.js')
    case ModuleId.Workspace:
      return import('../Workspace/Workspace.ipc.js')
    case ModuleId.ElectronNet:
      return import('../ElectronNet/ElectronNet.ipc.js')
    case ModuleId.Screen:
      return import('../Screen/Screen.ipc.js')
    case ModuleId.HandleElectronReady:
      return import('../HandleElectronReady/HandleElectronReady.ipc.js')
    case ModuleId.HandleWindowAllClosed:
      return import('../HandleWindowAllClosed/HandleWindowAllClosed.ipc.js')
    case ModuleId.HandleMessagePortForTerminalProcess:
      return import('../HandleMessagePortForTerminalProcess/HandleMessagePortForTerminalProcess.ipc.js')
    case ModuleId.HandleMessagePortForEmbedsProcess:
      return import('../HandleMessagePortForEmbedsProcess/HandleMessagePortForEmbedsProcess.ipc.js')
    case ModuleId.HandleMessagePortForFileSystemProcess:
      return import('../HandleMessagePortForFileSystemProcess/HandleMessagePortForFileSystemProcess.ipc.js')
    case ModuleId.TemporaryMessagePort:
      return import('../TemporaryMessagePort/TemporaryMessagePort.ipc.js')
    case ModuleId.GetElectronFileResponse:
      return import('../GetElectronFileResponse/GetElectronFileResponse.ipc.js')
    case ModuleId.HandleRemoteRequest:
      return import('../HandleRemoteRequest/HandleRemoteRequest.ipc.js')
    case ModuleId.HandleMessagePortForExtensionHostHelperProcess:
      return import('../HandleMessagePortForExtensionHostHelperProcess/HandleMessagePortForExtensionHostHelperProcess.ipc.js')
    case ModuleId.ContentSecurityPolicy:
      return import('../ContentSecurityPolicy/ContentSecurityPolicy.ipc.js')
    case ModuleId.HandleMessagePortForProcessExplorer:
      return import('../HandleMessagePortForProcessExplorer/HandleMessagePortForProcessExplorer.ipc.js')
    case ModuleId.HandleMessagePortForSearchProcess:
      return import('../HandleMessagePortForSearchProcess/HandleMessagePortForSearchProcess.ipc.js')
    case ModuleId.FileWatcher:
      return import('../FileWatcher/FileWatcher.ipc.js')
    case ModuleId.WebViewServer:
      return import('../WebViewServer/WebViewServer.ipc.js')
    case ModuleId.GetExtensions:
      return import('../GetExtensions/GetExtensions.ipc.js')
    case ModuleId.FileSystemDisk:
      return import('../FileSystemDisk/FileSystemDisk.ipc.js')
    case ModuleId.HandleRequest:
      return import('../HandleRequest/HandleRequest.ipc.js')
    case ModuleId.HandleMessagePortForClipBoardProcess:
      return import('../HandleMessagePortForClipBoardProcess/HandleMessagePortForClipBoardProcess.ipc.js')
    default:
      throw new Error(`module ${moduleId} not found`)
  }
}
