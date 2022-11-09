import * as ExtensionHostBraceCompletion from '../ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.js'
import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.js'
import * as ExtensionHostDefinition from '../ExtensionHostDefinition/ExtensionHostDefinition.js'
import * as ExtensionHostExtension from '../ExtensionHostExtension/ExtensionHostExtension.js'
import * as ExtensionHostImplementation from '../ExtensionHostImplementation/ExtensionHostImplementation.js'
import * as ExtensionHostReference from '../ExtensionHostReference/ExtensionHostReference.js'
import * as ExtensionHostTabCompletion from '../ExtensionHostTabCompletion/ExtensionHostTabCompletion.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import * as ExtensionHostTypeDefinition from '../ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.js'
import * as ExtensionHostTextSearch from '../ExtensionHostTextSearch/ExtensionHostTextSearch.js'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.js'
import * as ExtensionHostWorkspace from '../ExtensionHostWorkspace/ExtensionHostWorkspace.js'
import * as ExtensionHostFormatting from '../ExtensionHostFormatting/ExtensionHostFormatting.js'
import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.js'

const getFn = (method) => {
  switch (method) {
    case 'ExtensionHostExtension.activate':
    case 'ExtensionHostExtension.enableExtension':
      return ExtensionHostExtension.activate
    case 'Reference.execute':
    case 'References.execute':
    case 'ExtensionHostReference.executeReferenceProvider':
    case 'ExtensionHostReferences.executeReferenceProvider':
      return ExtensionHostReference.executeReferenceProvider
    case 'ExtensionHostCompletion.execute':
      return ExtensionHostCompletion.executeCompletionProvider
    case 'ExtensionHostTextDocument.syncFull':
      return TextDocument.syncFull
    case 'ExtensionHostTextDocument.setLanguageId':
      return TextDocument.setLanguageId
    case 'ExtensionHostTypeDefinition.executeTypeDefinitionProvider':
      return ExtensionHostTypeDefinition.executeTypeDefinitionProvider
    case 'ExtensionHost.executeTabCompletionProvider':
      return ExtensionHostTabCompletion.executeTabCompletionProvider
    case 'ExtensionHostBraceCompletion.executeBraceCompletionProvider':
      return ExtensionHostBraceCompletion.executeBraceCompletionProvider
    case 'ExtensionHostTextDocument.syncIncremental':
      return TextDocument.syncIncremental
    case 'ExtensionHostTextSearch.executeTextSearchProvider':
      return ExtensionHostTextSearch.executeTextSearchProvider
    case 'ExtensionHostCommand.executeCommand':
    case 'ExtensionHost.executeCommand':
      return ExtensionHostCommand.executeCommand
    case 'Workspace.setWorkspacePath':
      return ExtensionHostWorkspace.setWorkspacePath
    case 'ExtensionHostDefinition.executeDefinitionProvider':
      return ExtensionHostDefinition.executeDefinitionProvider
    case 'ExtensionHost.sourceControlGetChangedFiles':
      return ExtensionHostSourceControl.getChangedFiles
    case 'ExtensionHostFormatting.executeFormattingProvider':
      return ExtensionHostFormatting.executeFormattingProvider
    default:
      throw new Error(`[extension-host-worker] method not found: ${method}`)
  }
}

export const execute = (method, ...params) => {
  const fn = getFn(method)
  return fn(...params)
}
