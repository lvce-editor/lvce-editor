import * as ExtensionHostBraceCompletion from '../ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.js'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.js'
import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.js'
import * as ExtensionHostDefinition from '../ExtensionHostDefinition/ExtensionHostDefinition.js'
import * as ExtensionHostExtension from '../ExtensionHostExtension/ExtensionHostExtension.js'
import * as ExtensionHostFormatting from '../ExtensionHostFormatting/ExtensionHostFormatting.js'
import * as ExtensionHostImplementation from '../ExtensionHostImplementation/ExtensionHostImplementation.js'
import * as ExtensionHostReference from '../ExtensionHostReference/ExtensionHostReference.js'
import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.js'
import * as ExtensionHostTabCompletion from '../ExtensionHostTabCompletion/ExtensionHostTabCompletion.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import * as ExtensionHostTextSearch from '../ExtensionHostTextSearch/ExtensionHostTextSearch.js'
import * as ExtensionHostTypeDefinition from '../ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.js'

// prettier-ignore
export const create = () => {
  return {
    // Brace Completion
    registerBraceCompletionProvider:ExtensionHostBraceCompletion.registerBraceCompletionProvider,
    executeBraceCompletionProvider: ExtensionHostBraceCompletion.executeBraceCompletionProvider,

    // Command
    registerCommand: ExtensionHostCommand.registerCommand,
    executeCommand: ExtensionHostCommand.executeCommand,

    // Completion
    registerCompletionProvider:ExtensionHostCompletion.registerCompletionProvider,
    executeCompletionProvider: ExtensionHostCompletion.executeCompletionProvider,

    // Definition
    registerDefinitionProvider: ExtensionHostDefinition.registerDefinitionProvider,
    executeDefinitionProvider: ExtensionHostDefinition.executeDefinitionProvider,

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
  }
}
