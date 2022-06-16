import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.js'
import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.js'
import * as ExtensionHostDefinition from '../ExtensionHostDefinition/ExtensionHostDefinition.js'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.js'
import * as ExtensionHostFileSystem from '../ExtensionHostFileSystem/ExtensionHostFileSystem.js'
import * as ExtensionHostFormatting from '../ExtensionHostFormatting/ExtensionHostFormatting.js'
import * as ExtensionHostHover from '../ExtensionHostHover/ExtensionHostHover.js'
import * as ExtensionHostLinting from '../ExtensionHostLinting/ExtensionHostLinting.js'
import * as ExtensionHostOutputChannel from '../ExtensionHostOutputChannel/ExtensionHostOutputChannel.js'
import * as ExtensionHostRename from '../ExtensionHostRename/ExtensionHostRename.js'
import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.js'
import * as ExtensionHostTabCompletion from '../ExtensionHostTabCompletion/ExtensionHostTabCompletion.js'
import * as ExtensionHostTextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import * as ExtensionHostWorkspace from '../ExtensionHostWorkspace/ExtensionHostWorkspace.js'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js'
import * as Stats from '../Stats/Stats.js'
import * as ExtensionHostStatusBar from '../ExtensionHostStatusBar/ExtensionHostStatusBar.js'
import * as ExtensionHostQuickPick from '../ExtensionHostQuickPick/ExtensionHostQuickPick.js'
import * as ExtensionHostBraceCompletion from '../ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.js'

const getFn = (id) => {
  switch (id) {
    case 'Command.register':
      return ExtensionHostCommand.register
    case 'Command.execute':
    case 'executeCommand':
      return ExtensionHostCommand.execute
    case 384:
    case 'Completion.execute':
    case 'executeCompletionProvider':
      return ExtensionHostCompletion.executeCompletionProvider
    case 386:
    case 'executeTabCompletionProvider':
    case 'TabCompletion.execute':
      return ExtensionHostTabCompletion.executeTabCompletionProvider
    case 393:
    case 'Stats.getMemoryInfo':
      return Stats.getMemoryInfo
    case 394:
      return ExtensionHostSourceControl.getBadgeCount
    case 395:
    case 'Formatting.execute':
      return ExtensionHostFormatting.executeFormattingProvider
    case 396:
      return ExtensionHostCommand.execute
    case 400:
    case 'TextDocument.syncInitial':
    case 'TextDocument.syncFull':
      return ExtensionHostTextDocument.syncFull
    case 'TextDocument.syncIncremental':
      return ExtensionHostTextDocument.syncIncremental
    case 'TextDocument.setLanguageId':
      return ExtensionHostTextDocument.setLanguageId
    case 401:
    case 'Hover.execute':
      return ExtensionHostHover.executeHoverProvider
    case 402:
    case 'Diagnostic.execute':
      return ExtensionHostDiagnostic.executeDiagnosticProvider
    case 403:
      return ExtensionHostTextDocument.syncIncremental
    case 404:
    case 'Rename.executePrepareRename':
      return ExtensionHostRename.executePrepareRename
    case 405:
    case 'Rename.executeRename':
      return ExtensionHostRename.executeRename
    case 406:
    case 'Definition.executeDefinitionProvider':
      return ExtensionHostDefinition.executeDefinitionProvider
    case 407:
    case 'FileSystem.readFile':
      return ExtensionHostFileSystem.readFile
    case 408:
    case 'FileSystem.writeFile':
      return ExtensionHostFileSystem.writeFile
    case 409:
    case 'FileSystem.readDirWithFileTypes':
      return ExtensionHostFileSystem.readDirWithFileTypes
    case 410:
    case 'FileSystem.remove':
      return ExtensionHostFileSystem.remove
    case 411:
    case 'FileSystem.rename':
      return ExtensionHostFileSystem.rename
    case 'SourceControl.getBadgeCount':
      return ExtensionHostSourceControl.getBadgeCount
    case 'SourceControl.getModifiedFiles':
    case 'getSourceControlChangedFiles':
      return ExtensionHostSourceControl.sourceControlGetModifiedFiles
    case 412:
    case 'SourceControl.acceptInput':
      return ExtensionHostSourceControl.acceptInput
    case 416:
    case 'ExtensionManagement.enable':
    case 'enableExtension':
      return ExtensionManagement.enable
    case 'ExtensionManagement.disable':
      return ExtensionManagement.disable
    case 419:
    case 'OutputChannel.getOutputChannels':
      return ExtensionHostOutputChannel.getOutputChannels
    case 417:
    case 'FileSystem.getPathSeparator':
      return ExtensionHostFileSystem.getPathSeparator
    case 'Linting.execute':
      return ExtensionHostLinting.executeLintingProvider
    case 'Workspace.setWorkspacePath':
      return ExtensionHostWorkspace.setWorkspaceFolder
    case 'StatusBar.getStatusBarItems':
      return ExtensionHostStatusBar.getStatusBarItems
    case 'StatusBar.registerChangeListener':
      return ExtensionHostStatusBar.registerChangeListener
    case 'ExtensionHostQuickPick.handleQuickPickResult':
      return ExtensionHostQuickPick.handleQuickPickResult
    case 'BraceCompletion.execute':
      return ExtensionHostBraceCompletion.executeBraceCompletionProvider
    default:
      throw new Error(`unknown command ${id}`)
  }
}

export const invoke = async (command, ...args) => {
  const fn = getFn(command)
  return fn(...args)
}
