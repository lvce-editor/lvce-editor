import * as ModuleId from '../ModuleId/ModuleId.js'

const getPrefix = (commandId) => {
  return commandId.slice(0, commandId.indexOf('.'))
}

export const getModuleId = (commandId) => {
  const prefix = getPrefix(commandId)
  switch (prefix) {
    case 'ChromeExtension':
      return ModuleId.ChromeExtension
    case 'ClipBoard':
      return ModuleId.ClipBoard
    case 'Developer':
      return ModuleId.Developer
    case 'Download':
      return ModuleId.Download
    case 'ExtensionHost':
    case 'ExtensionHostBraceCompletion':
    case 'ExtensionHostClosingTag':
    case 'ExtensionHostCompletion':
    case 'ExtensionHostDefinition':
    case 'ExtensionHostDiagnostic':
    case 'ExtensionHostFileSystem':
    case 'ExtensionHostHover':
    case 'ExtensionHostImplementation':
    case 'ExtensionHostKeyBindings':
    case 'ExtensionHostLanguages':
    case 'ExtensionHostManagement':
    case 'ExtensionHostOutput':
    case 'ExtensionHostQuickPick':
    case 'ExtensionHostReferences':
    case 'EXtensionHostRename':
    case 'ExtensionHostSemanticTokens':
    case 'ExtensionHostSourceControl':
    case 'ExtensionHostTextDocument':
    case 'ExtensionHostWorkspace':
      return ModuleId.ExtensionHost
    case 'ExtensionManagement':
    case 'ExtensionColorTheme':
    case 'ExtensionIconTheme':
    case 'ExtensionLanguages':
      return ModuleId.ExtensionManagement
    case 'FileSystem':
      return ModuleId.FileSystem
    case 'GitLsFiles':
      return ModuleId.GitLsFiles
    case 'Native':
      return ModuleId.Native
    case 'OutputChannel':
      return ModuleId.OutputChannel
    case 'Platform':
      return ModuleId.Platform
    case 'Preferences':
      return ModuleId.Preferences
    case 'RecentlyOpened':
      return ModuleId.RecentlyOpened
    case 'Search':
      return ModuleId.Search
    case 'SearchFile':
      return ModuleId.SearchFile
    case 'Terminal':
      return ModuleId.Terminal
    case 4820:
      return ModuleId.TextDocument
    case 'WebSocketServer':
      return ModuleId.WebSocketServer
    case 'Workspace':
      return ModuleId.Workspace
    default:
      throw new Error(`command ${commandId} not found`)
  }
}
