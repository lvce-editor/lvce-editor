import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.ts'
import * as ExtensionHostBraceCompletion from '../ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.ts'
import * as ExtensionHostClosingTag from '../ExtensionHostClosingTag/ExtensionHostClosingTag.ts'
import * as ExtensionHostCodeActions from '../ExtensionHostCodeActions/ExtensionHostCodeActions.ts'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostConfiguration from '../ExtensionHostConfiguration/ExtensionHostConfiguration.ts'
import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.ts'
import * as ExtensionHostDebug from '../ExtensionHostDebug/ExtensionHostDebug.ts'
import * as ExtensionHostDefinition from '../ExtensionHostDefinition/ExtensionHostDefinition.ts'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'
import * as ExtensionHostExtension from '../ExtensionHostExtension/ExtensionHostExtension.ts'
import * as ExtensionHostSelection from '../ExtensionHostSelection/ExtensionHostSelection.ts'
import * as ExtensionHostFileSystem from '../ExtensionHostFileSystem/ExtensionHostFileSystem.ts'
import * as ExtensionHostFormatting from '../ExtensionHostFormatting/ExtensionHostFormatting.ts'
import * as ExtensionHostHover from '../ExtensionHostHover/ExtensionHostHover.ts'
import * as ExtensionHostImplementation from '../ExtensionHostImplementation/ExtensionHostImplementation.ts'
import * as ExtensionHostMockExec from '../ExtensionHostMockExec/ExtensionHostMockExec.ts'
import * as ExtensionHostMockRpc from '../ExtensionHostMockRpc/ExtensionHostMockRpc.ts'
import * as ExtensionHostReference from '../ExtensionHostReference/ExtensionHostReference.ts'
import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.ts'
import * as ExtensionHostStatusBar from '../ExtensionHostStatusBar/ExtensionHostStatusBar.ts'
import * as ExtensionHostTabCompletion from '../ExtensionHostTabCompletion/ExtensionHostTabCompletion.ts'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.ts'
import * as ExtensionHostTextSearch from '../ExtensionHostTextSearch/ExtensionHostTextSearch.ts'
import * as ExtensionHostTypeDefinition from '../ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.ts'
import * as ExtensionHostWorkspace from '../ExtensionHostWorkspace/ExtensionHostWorkspace.ts'

export const getFn = (method) => {
  switch (method) {
    case ExtensionHostCommandType.ExtensionActivate:
      return ExtensionHostExtension.activate
    case ExtensionHostCommandType.ReferenceExecuteReferenceProvider:
      return ExtensionHostReference.executeReferenceProvider
    case ExtensionHostCommandType.ReferenceExecuteFileReferenceProvider:
      return ExtensionHostReference.executefileReferenceProvider
    case ExtensionHostCommandType.CompletionExecute:
      return ExtensionHostCompletion.executeCompletionProvider
    case ExtensionHostCommandType.CompletionResolveExecute:
      return ExtensionHostCompletion.executeresolveCompletionItemProvider
    case ExtensionHostCommandType.TextDocumentSyncFull:
      return TextDocument.syncFull
    case ExtensionHostCommandType.TextDocumentSetLanguageId:
      return TextDocument.setLanguageId
    case ExtensionHostCommandType.TypeDefinitionExecuteTypeDefinitionProvider:
      return ExtensionHostTypeDefinition.executeTypeDefinitionProvider
    case ExtensionHostCommandType.TabCompletionExecuteTabCompletionProvider:
      return ExtensionHostTabCompletion.executeTabCompletionProvider
    case ExtensionHostCommandType.BraceCompletionExecuteBraceCompletionProvider:
      return ExtensionHostBraceCompletion.executeBraceCompletionProvider
    case ExtensionHostCommandType.TextDocumentSyncIncremental:
      return TextDocument.syncIncremental
    case ExtensionHostCommandType.TextSearchExecuteTextSearchProvider:
      return ExtensionHostTextSearch.executeTextSearchProvider
    case ExtensionHostCommandType.CommandExecute:
      return ExtensionHostCommand.executeCommand
    case ExtensionHostCommandType.DiagnosticExecuteDiagnosticProvider:
      return ExtensionHostDiagnostic.executeDiagnosticProvider
    case ExtensionHostCommandType.WorkspaceSetPath:
      return ExtensionHostWorkspace.setWorkspacePath
    case ExtensionHostCommandType.DefinitionExecuteDefinitionProvider:
      return ExtensionHostDefinition.executeDefinitionProvider
    case ExtensionHostCommandType.SourceControlGetChangedFiles:
      return ExtensionHostSourceControl.getChangedFiles
    case ExtensionHostCommandType.SourceControlAcceptInput:
      return ExtensionHostSourceControl.acceptInput
    case ExtensionHostCommandType.FormattingExecuteFormmattingProvider:
      return ExtensionHostFormatting.executeFormattingProvider
    case ExtensionHostCommandType.SourceControlGetFileBefore:
      return ExtensionHostSourceControl.getFileBefore
    case ExtensionHostCommandType.MockExec:
      return ExtensionHostMockExec.mockExec
    case ExtensionHostCommandType.MockRpc:
      return ExtensionHostMockRpc.mockRpc
    case ExtensionHostCommandType.FileSystemReadFile:
      return ExtensionHostFileSystem.readFile
    case ExtensionHostCommandType.FileSystemReadDirWithFileTypes:
      return ExtensionHostFileSystem.readDirWithFileTypes
    case ExtensionHostCommandType.FileSystemWriteFile:
      return ExtensionHostFileSystem.writeFile
    case ExtensionHostCommandType.FileSystemGetPathSeparator:
      return ExtensionHostFileSystem.getPathSeparator
    case ExtensionHostCommandType.SourceControlAdd:
      return ExtensionHostSourceControl.add
    case ExtensionHostCommandType.SourceControlDiscard:
      return ExtensionHostSourceControl.discard
    case ExtensionHostCommandType.SourceControlGetEnabledProviderIds:
      return ExtensionHostSourceControl.getEnabledProviderIds
    case ExtensionHostCommandType.SourceControlGetGroups:
      return ExtensionHostSourceControl.getGroups
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
    case 'ExtensionHostDebug.evaluate':
      return ExtensionHostDebug.evaluate
    case ExtensionHostCommandType.ClosingTagExecuteClosingTagProvider:
      return ExtensionHostClosingTag.executeClosingTagProvider
    case ExtensionHostCommandType.ImplementationExecuteImplementationProvider:
      return ExtensionHostImplementation.executeImplementationProvider
    case ExtensionHostCommandType.HoverExecute:
      return ExtensionHostHover.executeHoverProvider
    case ExtensionHostCommandType.StatusBarGetStatusBarItems:
      return ExtensionHostStatusBar.getStatusBarItems
    case ExtensionHostCommandType.StatusBarRegisterChangeListener:
      return ExtensionHostStatusBar.registerChangeListener
    case ExtensionHostCommandType.OrganizeImportsExecute:
      return ExtensionHostCodeActions.executeOrganizeImports
    case ExtensionHostCommandType.SelectionExecuteSelectionProvider:
      return ExtensionHostSelection.executeSelectionProvider
    case ExtensionHostCommandType.ConfigurationSetConfiguration:
      return ExtensionHostConfiguration.setConfigurations
    default:
      throw new CommandNotFoundError(method)
  }
}
