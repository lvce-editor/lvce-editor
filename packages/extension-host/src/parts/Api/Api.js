import * as ExtensionHostBraceCompletion from '../ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.js'
import * as ExtensionHostClosingTag from '../ExtensionHostClosingTag/ExtensionHostClosingTag.js'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.js'
import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.js'
import * as ExtensionHostConfiguration from '../ExtensionHostConfiguration/ExtensionHostConfiguration.js'
import * as ExtensionHostDefinition from '../ExtensionHostDefinition/ExtensionHostDefinition.js'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.js'
import * as ExtensionHostFileSystem from '../ExtensionHostFileSystem/ExtensionHostFileSystem.js'
import * as ExtensionHostFormatting from '../ExtensionHostFormatting/ExtensionHostFormatting.js'
import * as ExtensionHostHover from '../ExtensionHostHover/ExtensionHostHover.js'
import * as ExtensionHostImplementation from '../ExtensionHostImplementation/ExtensionHostImplementation.js'
import * as ExtensionHostNotification from '../ExtensionHostNotification/ExtensionHostNotification.js'
import * as ExtensionHostOutputChannel from '../ExtensionHostOutputChannel/ExtensionHostOutputChannel.js'
import * as ExtensionHostQuickPick from '../ExtensionHostQuickPick/ExtensionHostQuickPick.js'
import * as ExtensionHostReference from '../ExtensionHostReference/ExtensionHostReference.js'
import * as ExtensionHostRename from '../ExtensionHostRename/ExtensionHostRename.js'
import * as ExtensionHostSemanticTokens from '../ExtensionHostSemanticTokens/ExtensionHostSemanticTokens.js'
import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.js'
import * as ExtensionHostStatusBar from '../ExtensionHostStatusBar/ExtensionHostStatusBar.js'
import * as ExtensionHostTabCompletion from '../ExtensionHostTabCompletion/ExtensionHostTabCompletion.js'
import * as ExtensionHostTextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import * as ExtensionHostTypeDefinition from '../ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.js'
import * as ExtensionHostWorkspace from '../ExtensionHostWorkspace/ExtensionHostWorkspace.js'

const noop = () => {}

// prettier-ignore
export const vscode = {
  // AutoClose
  // registerAutoCloseProvider: AutoClose.registerAutoCloseProvider,
  // unregisterAutoCloseProvider: AutoClose.unregisterAutoCloseProvider,

  // Brace Completion
  executeBraceCompletionProvider: ExtensionHostBraceCompletion.executeBraceCompletionProvider,
  registerBraceCompletionProvider: ExtensionHostBraceCompletion.registerBraceCompletionProvider,

  // Closing Tag
  registerClosingTagProvider: ExtensionHostClosingTag.registerClosingTagProvider,
  executeClosingTagProvider: ExtensionHostClosingTag.executeClosingTagProvider,

  // Command
  registerCommand: ExtensionHostCommand.register, // Command.registerCommand,
  unregisterCommand: noop, // Command.unregisterCommand,
  executeCommand: ExtensionHostCommand.execute, // Command.executeCommand,

  // Completion
  executeCompletionProvider: ExtensionHostCompletion.executeCompletionProvider,
  registerCompletionProvider: ExtensionHostCompletion.registerCompletionProvider,
  unregisterCompletionProvider: ExtensionHostCompletion.unregisterCompletionProvider,

  // Configuration
  getConfiguration: ExtensionHostConfiguration.getConfiguration,

  // Custom Editor
  registerCustomEditorProvider: noop, // CustomEditor.registerCustomEditorProvider,

  // Definition
  executeDefinitionProvider: ExtensionHostDefinition.executeDefinitionProvider,
  registerDefinitionProvider: ExtensionHostDefinition.registerDefinitionProvider,

  // Diagnostic
  registerDiagnosticProvider: ExtensionHostDiagnostic.registerDiagnosticProvider,

  // File system
  registerFileSystemProvider: ExtensionHostFileSystem.registerFileSystemProvider,
  readFile: ExtensionHostFileSystem.readFile,
  writeFile: ExtensionHostFileSystem.writeFile,
  readDirWithFileTypes: ExtensionHostFileSystem.readDirWithFileTypes,

  // Formatting
  registerFormattingProvider: ExtensionHostFormatting.registerFormattingProvider,

  // Hover
  registerHoverProvider: ExtensionHostHover.registerHoverProvider,

  // Implementation
  registerImplementationProvider: ExtensionHostImplementation.registerImplementationProvider,
  executeImplementationProvider: ExtensionHostImplementation.executeImplementationProvider,

  // Notification
  showNotification: ExtensionHostNotification.showNotification,
  showNotificationWithOptions: ExtensionHostNotification.showNotificationWithOptions,
  hideNotification: ExtensionHostNotification.hide,

  // OutputChannel
  createOutputChannel: ExtensionHostOutputChannel.createOutputChannel,
  registerOutputChannel: ExtensionHostOutputChannel.registerOutputChannel,

  // QuickPick
  showQuickPick: ExtensionHostQuickPick.showQuickPick,

  // References
  registerReferenceProvider: ExtensionHostReference.registerReferenceProvider,
  executeReferenceProvider: ExtensionHostReference.executeReferenceProvider,

  // Rename
  executeRenameProvider: ExtensionHostRename.executePrepareRename,
  registerRenameProvider: ExtensionHostRename.registerRenameProvider,

  // Semantic Tokens
  registerSemanticTokenProvider: ExtensionHostSemanticTokens.registerSemanticTokenProvider,
  executeSemanticTokenProvider: ExtensionHostSemanticTokens.executeSemanticTokenProvider,

  // Source Control
  registerSourceControlProvider: ExtensionHostSourceControl.registerSourceControlProvider,
  updateGitDecorations: ExtensionHostSourceControl.updateGitDecorations,

  // Status Bar
  registerStatusBarItem: ExtensionHostStatusBar.registerStatusBarItem,

  // Tab Completion
  executeTabCompletionProvider: ExtensionHostTabCompletion.executeTabCompletionProvider,
  registerTabCompletionProvider: ExtensionHostTabCompletion.registerTabCompletionProvider,

  // TextDocument
  onDidOpenTextDocument: ExtensionHostTextDocument.onDidOpenTextDocument,
  onWillChangeTextDocument: ExtensionHostTextDocument.onWillChangeTextDocument,
  onDidChangeTextDocument: ExtensionHostTextDocument.onDidChangeTextDocument,
  onDidSaveTextDocument: ExtensionHostTextDocument.onDidSaveTextDocument,
  getTextFromTextDocument: ExtensionHostTextDocument.getText,
  applyEdit: ExtensionHostTextDocument.applyEdit,
  getPosition: ExtensionHostTextDocument.getPosition,
  getOffset: ExtensionHostTextDocument.getOffset,
  setLanguageId: ExtensionHostTextDocument.setLanguageId,
  getTextDocuments: ExtensionHostTextDocument.getTextDocuments,

  // Type Definition
  registerTypeDefinitionProvider: ExtensionHostTypeDefinition.registerTypeDefinitionProvider,
  executeTypeDefinitionProvider: ExtensionHostTypeDefinition.executeTypeDefinitionProvider,

  // Workspace
  getWorkspaceFolder: ExtensionHostWorkspace.getWorkspaceFolder,
  setWorkspaceFolder: ExtensionHostWorkspace.setWorkspaceFolder,

  beep() {
    console.log('TODO beep')
  },
}
