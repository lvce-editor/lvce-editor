import * as EditorCompletionType from '../EditorCompletionType/EditorCompletionType.ts'
import * as ExtensionHostAjax from '../ExtensionHostAjax/ExtensionHostAjax.ts'
import * as ExtensionHostBraceCompletion from '../ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.ts'
import * as ExtensionHostClosingTag from '../ExtensionHostClosingTag/ExtensionHostClosingTag.ts'
import * as ExtensionHostCodeActions from '../ExtensionHostCodeActions/ExtensionHostCodeActions.ts'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.ts'
import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.ts'
import * as ExtensionHostConfiguration from '../ExtensionHostConfiguration/ExtensionHostConfiguration.ts'
import * as ExtensionHostDebug from '../ExtensionHostDebug/ExtensionHostDebug.ts'
import * as ExtensionHostDefinition from '../ExtensionHostDefinition/ExtensionHostDefinition.ts'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'
import * as ExtensionHostDialog from '../ExtensionHostDialog/ExtensionHostDialog.ts'
import * as ExtensionHostEnv from '../ExtensionHostEnv/ExtensionHostEnv.ts'
import * as ExtensionHostExec from '../ExtensionHostExec/ExtensionHostExec.ts'
import * as ExtensionHostFileSystem from '../ExtensionHostFileSystem/ExtensionHostFileSystem.ts'
import * as ExtensionHostFormatting from '../ExtensionHostFormatting/ExtensionHostFormatting.ts'
import * as ExtensionHostGetOffset from '../ExtensionHostGetOffset/ExtensionHostGetOffset.ts'
import * as ExtensionHostGetPosition from '../ExtensionHostGetPosition/ExtensionHostGetPosition.ts'
import * as ExtensionHostHover from '../ExtensionHostHover/ExtensionHostHover.ts'
import * as ExtensionHostImplementation from '../ExtensionHostImplementation/ExtensionHostImplementation.ts'
import * as ExtensionHostNodeIpc from '../ExtensionHostNodeRpc/ExtensionHostNodeRpc.ts'
import * as ExtensionHostPrompt from '../ExtensionHostPrompt/ExtensionHostPrompt.ts'
import * as ExtensionHostQuickPick from '../ExtensionHostQuickPick/ExtensionHostQuickPick.ts'
import * as ExtensionHostReference from '../ExtensionHostReference/ExtensionHostReference.ts'
import * as ExtensionHostRename from '../ExtensionHostRename/ExtensionHostRename.ts'
import * as ExtensionHostRpc from '../ExtensionHostRpc/ExtensionHostRpc.ts'
import * as ExtensionHostSelection from '../ExtensionHostSelection/ExtensionHostSelection.ts'
import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.ts'
import * as ExtensionHostTabCompletion from '../ExtensionHostTabCompletion/ExtensionHostTabCompletion.ts'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.ts'
import * as ExtensionHostTextSearch from '../ExtensionHostTextSearch/ExtensionHostTextSearch.ts'
import * as ExtensionHostTypeDefinition from '../ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as ExtensionHostWorkspace from '../ExtensionHostWorkspace/ExtensionHostWorkspace.ts'
import { FormattingError } from '../FormattingError/FormattingError.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'
import { VError } from '../VError/VError.ts'

export const api = {
  // Ajax
  getJson: ExtensionHostAjax.getJson,

  // Brace Completion
  registerBraceCompletionProvider: ExtensionHostBraceCompletion.registerBraceCompletionProvider,
  executeBraceCompletionProvider: ExtensionHostBraceCompletion.executeBraceCompletionProvider,

  // Closing Tag
  registerClosingTagProvider: ExtensionHostClosingTag.registerClosingTagProvider,
  executeClosingTagProvider: ExtensionHostClosingTag.executeClosingTagProvider,

  // Code Action
  registerCodeActionsProvider: ExtensionHostCodeActions.registerCodeActionProvider,

  // Command
  registerCommand: ExtensionHostCommand.registerCommand,
  executeCommand: ExtensionHostCommand.executeCommand,

  // Completion
  registerCompletionProvider: ExtensionHostCompletion.registerCompletionProvider,
  executeCompletionProvider: ExtensionHostCompletion.executeCompletionProvider,
  EditorCompletionType,

  // Configuration
  getConfiguration: ExtensionHostConfiguration.getConfiguration,

  // Debug
  registerDebugProvider: ExtensionHostDebug.registerDebugProvider,

  // Definition
  registerDefinitionProvider: ExtensionHostDefinition.registerDefinitionProvider,
  executeDefinitionProvider: ExtensionHostDefinition.executeDefinitionProvider,

  // Diagnostic
  registerDiagnosticProvider: ExtensionHostDiagnostic.registerDiagnosticProvider,
  executeDiagnosticProvider: ExtensionHostDiagnostic.executeDiagnosticProvider,

  // Dialog
  showInformationMessage: ExtensionHostDialog.showInformationMessage,

  // Env
  env: ExtensionHostEnv.env,

  // Errors
  FormattingError,
  VError,

  // Exec
  exec: ExtensionHostExec.exec,

  // File System
  registerFileSystemProvider: ExtensionHostFileSystem.registerFileSystemProvider,

  // Formatting
  registerFormattingProvider: ExtensionHostFormatting.registerFormattingProvider,
  executeFormattingProvider: ExtensionHostFormatting.executeFormattingProvider,

  // Get Offset
  getOffset: ExtensionHostGetOffset.getOffset,

  // Get Position
  getPosition: ExtensionHostGetPosition.getPosition,

  // Hover
  registerHoverProvider: ExtensionHostHover.registerHoverProvider,
  executeHoverProvider: ExtensionHostHover.executeHoverProvider,

  // Rpc
  createRpc: ExtensionHostRpc.createRpc,
  createNodeRpc: ExtensionHostNodeIpc.createNodeRpc,

  // Implementation
  registerImplementationProvider: ExtensionHostImplementation.registerImplementationProvider,
  executeImplementationProvider: ExtensionHostImplementation.executeImplementationProvider,

  // Prompt
  confirm: ExtensionHostPrompt.confirm,

  // QuickPick
  showQuickPick: ExtensionHostQuickPick.showQuickPick,

  // Rename
  registerRenameProvider: ExtensionHostRename.registerRenameProvider,
  executeRenameProvider: ExtensionHostRename.executeRenameProvider,
  executePrepareRenameProvider: ExtensionHostRename.executeprepareRenameProvider,

  // Reference
  registerReferenceProvider: ExtensionHostReference.registerReferenceProvider,
  executeReferenceProvider: ExtensionHostReference.executeReferenceProvider,

  // Selection
  registerSelectionProvider: ExtensionHostSelection.registerSelectionProvider,
  executeSelectionProvider: ExtensionHostSelection.executeSelectionProvider,

  // Source Control
  registerSourceControlProvider: ExtensionHostSourceControl.registerSourceControlProvider,

  // Tab Completion
  registerTabCompletionProvider: ExtensionHostTabCompletion.registerTabCompletionProvider,
  executeTabCompletionProvider: ExtensionHostTabCompletion.executeTabCompletionProvider,

  // Text Document
  getTextFromTextDocument: TextDocument.getText,

  // Text Search
  registerTextSearchProvider: ExtensionHostTextSearch.registerTextSearchProvider,
  executeTextSearchProvider: ExtensionHostTextSearch.executeTextSearchProvider,
  TextSearchResultType,

  // Type Definition
  registerTypeDefinitionProvider: ExtensionHostTypeDefinition.registerTypeDefinitionProvider,
  executeTypeDefinitionProvider: ExtensionHostTypeDefinition.executeTypeDefinitionProvider,

  // Worker
  createWorker: ExtensionHostWorker.createWorker,

  // Workspace
  getWorkspaceFolder: ExtensionHostWorkspace.getWorkspaceFolder,
}
