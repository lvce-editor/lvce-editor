import * as Command from '../Command/Command.js'
import * as ExtensionHost from './ExtensionHost.js'
import * as ExtensionHostCommand from './ExtensionHostCommand.js'
import * as ExtensionHostCompletion from './ExtensionHostCompletion.js'
import * as ExtensionHostSourceControl from './ExtensionHostSourceControl.js'
import * as ExtensionHostTabCompletion from './ExtensionHostTabCompletion.js'
import * as ExtensionHostStats from './ExtensionHostStats.js'
import * as ExtensionHostFormatting from './ExtensionHostFormatting.js'
import * as ExtensionHostTextDocument from './ExtensionHostTextDocument.js'
import * as ExtensionHostHover from './ExtensionHostHover.js'
import * as ExtensionHostDiagnostic from './ExtensionHostDiagnostic.js'
import * as ExtensionHostRename from './ExtensionHostRename.js'
import * as ExtensionHostDefinition from './ExtensionHostDefinition.js'
import * as ExtensionHostFileSystem from './ExtensionHostFileSystem.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'
import * as ExtensionHostWorkspace from './ExtensionHostWorkspace.js'
import * as ExtensionHostOutput from './ExtensionHostOutput.js'
import * as ExtensionHostLanguages from './ExtensionHostLanguages.js'
import * as ExtensionHostColorTheme from './ExtensionHostColorTheme.js'
import * as ExtensionHostKeyBindings from './ExtensionHostKeyBindings.js'
import * as ExtensionHostIconTheme from './ExtensionHostIconTheme.js'
import * as ExtensionHostStatusBar from './ExtensionHostStatusBar.js'
import * as ExtensionHostQuickPick from './ExtensionHostQuickPick.js'
import * as ExtensionHostBraceCompletion from './ExtensionHostBraceCompletion.js'
import * as ExtensionHostReferences from './ExtensionHostReference.js'
import * as ExtensionHostImplementation from './ExtensionHostImplementation.js'
import * as ExtensionHostTypeDefinition from './ExtensionHostTypeDefinition.js'
import * as ExtensionHostClosingTag from './ExtensionHostClosingTag.js'
import * as ExtensionHostSemanticTokens from './ExtensionHostSemanticTokens.js'

export const __initialize__ = () => {
  Command.register('ExtensionHost.getCommands', ExtensionHostCommand.getCommandsIpc)
  Command.register('ExtensionHostCompletion.execute', ExtensionHost.wrapExtensionHostCommand(ExtensionHostCompletion.executeCompletionProvider))
  // Command.register(385, ExtensionHost.textDocumentSync)
  Command.register('ExtensionHost.executeTabCompletionProvider', ExtensionHost.wrapExtensionHostCommand(ExtensionHostTabCompletion.executeTabCompletionProvider))
  Command.register('ExtensionHost.getLanguages', ExtensionHostLanguages.getLanguages)
  Command.register('ExtensionHost.getIconThemeJson', ExtensionHostIconTheme.getIconTheme)
  Command.register('ExtensionHostKeyBindings.getKeyBindings', ExtensionHostKeyBindings.getKeyBindings)
  Command.register('ExtensionHost.executeCommand', ExtensionHost.wrapExtensionHostCommand(ExtensionHostCommand.executeCommand))
  Command.register('ExtensionHost.getColorThemeJson', ExtensionHostColorTheme.getColorThemeJson)
  Command.register('ExtensionHost.getColorThemeNames', ExtensionHostColorTheme.getColorThemeNames)
  Command.register('ExtensionHost.getMemoryUsage', ExtensionHost.wrapExtensionHostCommand(ExtensionHostStats.getMemoryUsage))
  Command.register('ExtensionHost.getSourceControlBadgeCount', ExtensionHost.wrapExtensionHostCommand(ExtensionHostSourceControl.getSourceControlBadgeCount))
  Command.register('ExtensionHost.format', ExtensionHost.wrapExtensionHostCommand(ExtensionHostFormatting.format))
  Command.register('ExtensionHost.executeCommand', ExtensionHost.wrapExtensionHostCommand(ExtensionHostCommand.executeCommand))

  Command.register('ExtensionHost.sourceControlGetChangedFiles', ExtensionHost.wrapExtensionHostCommand(ExtensionHostSourceControl.getSourceControlChangedFiles))
  Command.register('ExtensionHost.getLanguageConfiguration', ExtensionHostLanguages.getLanguageConfiguration)
  Command.register('ExtensionHost.getColorThemes', ExtensionHostColorTheme.getColorThemes)
  Command.register('ExtensionHostTextDocument.syncFull', ExtensionHost.wrapExtensionHostCommand(ExtensionHostTextDocument.textDocumentSyncInitial))
  Command.register('ExtensionHostHover.execute', ExtensionHost.wrapExtensionHostCommand(ExtensionHostHover.executeHoverProvider))
  Command.register('ExtensionHostDiagnostic.execute', ExtensionHost.wrapExtensionHostCommand(ExtensionHostDiagnostic.executeDiagnosticProvider))
  Command.register('ExtensionHostTextDocument.syncIncremental', ExtensionHost.wrapExtensionHostCommand(ExtensionHostTextDocument.textDocumentSyncIncremental))
  Command.register('ExtensionHostRename.executePrepareRename', ExtensionHost.wrapExtensionHostCommand(ExtensionHostRename.executePrepareRename))
  Command.register('ExtensionHostRename.executeRename', ExtensionHost.wrapExtensionHostCommand(ExtensionHostRename.executeRename))
  Command.register('ExtensionHostDefinition.executeDefinitionProvider', ExtensionHost.wrapExtensionHostCommand(ExtensionHostDefinition.executeDefinitionProvider))
  Command.register('ExtensionHostFileSystem.readFile', ExtensionHost.wrapExtensionHostCommand(ExtensionHostFileSystem.readFile))
  Command.register('ExtensionHostFileSystem.writeFile', ExtensionHost.wrapExtensionHostCommand(ExtensionHostFileSystem.writeFile))
  Command.register('ExtensionHostFileSystem.readDirWithFileTypes', ExtensionHost.wrapExtensionHostCommand(ExtensionHostFileSystem.readDirWithFileTypes))
  Command.register('ExtensionHostFileSystem.remove', ExtensionHost.wrapExtensionHostCommand(ExtensionHostFileSystem.remove))
  Command.register('ExtensionHostFileSystem.rename', ExtensionHost.wrapExtensionHostCommand(ExtensionHostFileSystem.rename))
  Command.register('ExtensionHostSourceControl.acceptInput', ExtensionHost.wrapExtensionHostCommand(ExtensionHostSourceControl.sourceControlAcceptInput))
  Command.register('ExtensionHost.start', ExtensionHost.start)
  Command.register('ExtensionHost.activateAll', ExtensionHost.wrapExtensionHostCommand(ExtensionHostManagement.activateAll))
  Command.register('ExtensionHost.enableExtension', ExtensionHost.wrapExtensionHostCommand(ExtensionHostManagement.enableExtension))
  Command.register('ExtensionHostFileSystem.getPathSeparator', ExtensionHost.wrapExtensionHostCommand(ExtensionHostFileSystem.getPathSeparator))
  Command.register('ExtensionHost.setWorkspacePath', ExtensionHost.wrapExtensionHostCommand(ExtensionHostWorkspace.setWorkspacePath))
  Command.register('ExtensionHost.setWorkspaceRoot', ExtensionHost.wrapExtensionHostCommand(ExtensionHostWorkspace.setWorkspacePath))
  Command.register('ExtensionHostOutput.getOutputChannels', ExtensionHost.wrapExtensionHostCommand(ExtensionHostOutput.getOutputChannels))
  Command.register('ExtensionHost.getStatusBarItems', ExtensionHost.wrapExtensionHostCommand(ExtensionHostStatusBar.getStatusBarItems))
  Command.register('ExtensionHostStatusBar.registerChangeListener', ExtensionHost.wrapExtensionHostCommand(ExtensionHostStatusBar.registerChangeListener))
  Command.register('ExtensionHostTextDocument.setLanguageId', ExtensionHost.wrapExtensionHostCommand(ExtensionHostTextDocument.setLanguageId))
  Command.register('ExtensionHostQuickPick.handleQuickPickResult', ExtensionHost.wrapExtensionHostCommand(ExtensionHostQuickPick.handleQuickPickResult))
  Command.register('ExtensionHostBraceCompletion.executeBraceCompletionProvider', ExtensionHost.wrapExtensionHostCommand(ExtensionHostBraceCompletion.executeBraceCompletionProvider))
  Command.register('ExtensionHostReferences.executeReferenceProvider', ExtensionHost.wrapExtensionHostCommand(ExtensionHostReferences.executeReferenceProvider))
  Command.register('ExtensionHostImplementation.executeImplementationProvider', ExtensionHost.wrapExtensionHostCommand(ExtensionHostImplementation.executeImplementationProvider))
  Command.register('ExtensionHostClosingTag.executeTypeDefinitionProvider', ExtensionHost.wrapExtensionHostCommand(ExtensionHostTypeDefinition.executeTypeDefinitionProvider))
  Command.register('ExtensionHostClosingTag.executeClosingTagProvider', ExtensionHost.wrapExtensionHostCommand(ExtensionHostClosingTag.executeClosingTagProvider))
  Command.register('ExtensionHostSemanticTokens.executeSemanticTokenProvider', ExtensionHost.wrapExtensionHostCommand(ExtensionHostSemanticTokens.executeSemanticTokenProvider))
}
