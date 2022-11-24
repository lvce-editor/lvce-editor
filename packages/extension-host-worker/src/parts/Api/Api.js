import * as ExtensionHostBraceCompletion from '../ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.js'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.js'
import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.js'
import * as ExtensionHostConfiguration from '../ExtensionHostConfiguration/ExtensionHostConfiguration.js'
import * as ExtensionHostDefinition from '../ExtensionHostDefinition/ExtensionHostDefinition.js'
import * as ExtensionHostEnv from '../ExtensionHostEnv/ExtensionHostEnv.js'
import * as ExtensionHostExec from '../ExtensionHostExec/ExtensionHostExec.js'
import * as ExtensionHostFormatting from '../ExtensionHostFormatting/ExtensionHostFormatting.js'
import * as ExtensionHostImplementation from '../ExtensionHostImplementation/ExtensionHostImplementation.js'
import * as ExtensionHostReference from '../ExtensionHostReference/ExtensionHostReference.js'
import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.js'
import * as ExtensionHostTabCompletion from '../ExtensionHostTabCompletion/ExtensionHostTabCompletion.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import * as ExtensionHostTextSearch from '../ExtensionHostTextSearch/ExtensionHostTextSearch.js'
import * as ExtensionHostTypeDefinition from '../ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.js'
import * as ExtensionHostWorkspace from '../ExtensionHostWorkspace/ExtensionHostWorkspace.js'
import * as ExtensionHostFileSystem from '../ExtensionHostFileSystem/ExtensionHostFileSystem.js'

import { VError } from '../VError/VError.js'

class FormattingError extends Error {
  constructor(message, codeFrame) {
    super(message)
    this.codeFrame = codeFrame
    this.name = 'FormattingError'
  }
}

// prettier-ignore
export const api =  {
  // Brace Completion
  registerBraceCompletionProvider:ExtensionHostBraceCompletion.registerBraceCompletionProvider,
  executeBraceCompletionProvider: ExtensionHostBraceCompletion.executeBraceCompletionProvider,

  // Command
  registerCommand: ExtensionHostCommand.registerCommand,
  executeCommand: ExtensionHostCommand.executeCommand,

  // Completion
  registerCompletionProvider:ExtensionHostCompletion.registerCompletionProvider,
  executeCompletionProvider: ExtensionHostCompletion.executeCompletionProvider,


  // Configuration
  getConfiguration: ExtensionHostConfiguration.getConfiguration,

  // Definition
  registerDefinitionProvider: ExtensionHostDefinition.registerDefinitionProvider,
  executeDefinitionProvider: ExtensionHostDefinition.executeDefinitionProvider,

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

  // Implementation
  registerImplementationProvider: ExtensionHostImplementation.registerImplementationProvider,
  executeImplementationProvider: ExtensionHostImplementation.executeImplementationProvider,

  // Reference
  registerReferenceProvider: ExtensionHostReference.registerReferenceProvider,
  executeReferenceProvider: ExtensionHostReference.executeReferenceProvider,

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

  // Type Definition
  registerTypeDefinitionProvider: ExtensionHostTypeDefinition.registerTypeDefinitionProvider,
  executeTypeDefinitionProvider: ExtensionHostTypeDefinition.executeTypeDefinitionProvider,

  // Workspace
  getWorkspaceFolder: ExtensionHostWorkspace.getWorkspaceFolder
}
