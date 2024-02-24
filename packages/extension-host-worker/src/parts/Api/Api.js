import * as EditorCompletionType from '../EditorCompletionType/EditorCompletionType.js'
import * as ExtensionHostAjax from '../ExtensionHostAjax/ExtensionHostAjax.js'
import * as ExtensionHostBraceCompletion from '../ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.js'
import * as ExtensionHostClosingTag from '../ExtensionHostClosingTag/ExtensionHostClosingTag.js'
import * as ExtensionHostCodeActions from '../ExtensionHostCodeActions/ExtensionHostCodeActions.js'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.js'
import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.js'
import * as ExtensionHostConfiguration from '../ExtensionHostConfiguration/ExtensionHostConfiguration.js'
import * as ExtensionHostQuickPick from '../ExtensionHostQuickPick/ExtensionHostQuickPick.js'
import * as ExtensionHostDebug from '../ExtensionHostDebug/ExtensionHostDebug.js'
import * as ExtensionHostDefinition from '../ExtensionHostDefinition/ExtensionHostDefinition.js'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.js'
import * as ExtensionHostEnv from '../ExtensionHostEnv/ExtensionHostEnv.js'
import * as ExtensionHostExec from '../ExtensionHostExec/ExtensionHostExec.js'
import * as ExtensionHostFileSystem from '../ExtensionHostFileSystem/ExtensionHostFileSystem.js'
import * as ExtensionHostFormatting from '../ExtensionHostFormatting/ExtensionHostFormatting.js'
import * as ExtensionHostGetOffset from '../ExtensionHostGetOffset/ExtensionHostGetOffset.js'
import * as ExtensionHostGetPosition from '../ExtensionHostGetPosition/ExtensionHostGetPosition.js'
import * as ExtensionHostHover from '../ExtensionHostHover/ExtensionHostHover.js'
import * as ExtensionHostImplementation from '../ExtensionHostImplementation/ExtensionHostImplementation.js'
import * as ExtensionHostNodeIpc from '../ExtensionHostNodeRpc/ExtensionHostNodeRpc.js'
import * as ExtensionHostReference from '../ExtensionHostReference/ExtensionHostReference.js'
import * as ExtensionHostRpc from '../ExtensionHostRpc/ExtensionHostRpc.js'
import * as ExtensionHostSelection from '../ExtensionHostSelection/ExtensionHostSelection.js'
import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.js'
import * as ExtensionHostTabCompletion from '../ExtensionHostTabCompletion/ExtensionHostTabCompletion.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import * as ExtensionHostTextSearch from '../ExtensionHostTextSearch/ExtensionHostTextSearch.js'
import * as ExtensionHostTypeDefinition from '../ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as ExtensionHostWorkspace from '../ExtensionHostWorkspace/ExtensionHostWorkspace.js'
import { FormattingError } from '../FormattingError/FormattingError.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import { VError } from '../VError/VError.js'

// prettier-ignore
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
  showInformationMessage:

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

  // QuickPick
  showQuickPick: ExtensionHostQuickPick.showQuickPick,

  // Reference
  registerReferenceProvider: ExtensionHostReference.registerReferenceProvider,
  executeReferenceProvider: ExtensionHostReference.executeReferenceProvider,

  // Selection
  registerSelectionProvider:ExtensionHostSelection.registerSelectionProvider,
  executeSelectionProvider:ExtensionHostSelection.executeSelectionProvider,

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
  getWorkspaceFolder: ExtensionHostWorkspace.getWorkspaceFolder
}
