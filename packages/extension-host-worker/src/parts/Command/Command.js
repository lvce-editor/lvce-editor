import { CommandNotFoundError } from '../Errors/Errors.js'
import * as ExtensionHostBraceCompletion from '../ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.js'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.js'
import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.js'
import * as ExtensionHostDebug from '../ExtensionHostDebug/ExtensionHostDebug.js'
import * as ExtensionHostDefinition from '../ExtensionHostDefinition/ExtensionHostDefinition.js'
import * as ExtensionHostExtension from '../ExtensionHostExtension/ExtensionHostExtension.js'
import * as ExtensionHostFileSystem from '../ExtensionHostFileSystem/ExtensionHostFileSystem.js'
import * as ExtensionHostFormatting from '../ExtensionHostFormatting/ExtensionHostFormatting.js'
import * as ExtensionHostMockExec from '../ExtensionHostMockExec/ExtensionHostMockExec.js'
import * as ExtensionHostReference from '../ExtensionHostReference/ExtensionHostReference.js'
import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.js'
import * as ExtensionHostTabCompletion from '../ExtensionHostTabCompletion/ExtensionHostTabCompletion.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import * as ExtensionHostTextSearch from '../ExtensionHostTextSearch/ExtensionHostTextSearch.js'
import * as ExtensionHostTypeDefinition from '../ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.js'
import * as ExtensionHostWorkspace from '../ExtensionHostWorkspace/ExtensionHostWorkspace.js'

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
    case 'ExtensionHostSourceControl.acceptInput':
    case 'ExtensionHost.sourceControlAcceptInput':
      return ExtensionHostSourceControl.acceptInput
    case 'ExtensionHostFormatting.executeFormattingProvider':
      return ExtensionHostFormatting.executeFormattingProvider
    case 'ExtensionHostMockExec.mockExec':
      return ExtensionHostMockExec.mockExec
    case 'ExtensionHostFileSystem.readFile':
      return ExtensionHostFileSystem.readFile
    case 'ExtensionHostFileSystem.readDirWithFileTypes':
      return ExtensionHostFileSystem.readDirWithFileTypes
    case 'ExtensionHostFileSystem.writeFile':
      return ExtensionHostFileSystem.writeFile
    case 'ExtensionHostFileSystem.getPathSeparator':
      return ExtensionHostFileSystem.getPathSeparator
    case 'ExtensionHostSourceControl.add':
      return ExtensionHostSourceControl.add
    case 'ExtensionHostSourceControl.discard':
      return ExtensionHostSourceControl.discard
    case 'ExtensionHostSourceControl.getEnabledProviderIds':
      return ExtensionHostSourceControl.getEnabledProviderIds
    case 'ExtensionHostDebug.listProcesses':
      return ExtensionHostDebug.listProcesses
    case 'ExtensionHostDebug.pause':
      return ExtensionHostDebug.pause
    case 'ExtensionHostDebug.resume':
      return ExtensionHostDebug.resume
    case 'ExtensionHostDebug.setPauseOnException':
      return ExtensionHostDebug.setPauseOnException
    case 'ExtensionHostDebug.start':
      return ExtensionHostDebug.start
    case 'ExtensionHostDebug.stepOver':
      return ExtensionHostDebug.stepOver
    case 'ExtensionHostDebug.stepOut':
      return ExtensionHostDebug.stepOut
    case 'ExtensionHostDebug.stepInto':
      return ExtensionHostDebug.stepInto
    case 'ExtensionHostDebug.getProperties':
      return ExtensionHostDebug.getProperties
    default:
      throw new CommandNotFoundError(`method not found: ${method}`)
  }
}

export const execute = (method, ...params) => {
  const fn = getFn(method)
  return fn(...params)
}
