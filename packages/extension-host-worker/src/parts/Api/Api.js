import * as ExtensionHostBraceCompletion from '../ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.js'
import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.js'
import * as ExtensionHostDefinition from '../ExtensionHostDefinition/ExtensionHostDefinition.js'
import * as ExtensionHostExtension from '../ExtensionHostExtension/ExtensionHostExtension.js'
import * as ExtensionHostImplementation from '../ExtensionHostImplementation/ExtensionHostImplementation.js'
import * as ExtensionHostReference from '../ExtensionHostReference/ExtensionHostReference.js'
import * as ExtensionHostTabCompletion from '../ExtensionHostTabCompletion/ExtensionHostTabCompletion.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import * as ExtensionHostTypeDefinition from '../ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.js'

// prettier-ignore
export const createCommandMap = () => {
  return {
    'ExtensionHostExtension.activate': ExtensionHostExtension.activate,
    'ExtensionHostExtension.enableExtension': ExtensionHostExtension.activate,
    'Reference.execute': ExtensionHostReference.executeReferenceProvider,
    'References.execute': ExtensionHostReference.executeReferenceProvider,
    'ExtensionHostCompletion.execute': ExtensionHostCompletion.executeCompletionProvider,
    'ExtensionHostTextDocument.syncFull': TextDocument.syncFull,
    'ExtensionHostTypeDefinition.executeTypeDefinitionProvider': ExtensionHostTypeDefinition.executeTypeDefinitionProvider,
  }
}

// prettier-ignore
export const create = () => {
  return {
    // Brace Completion
    registerBraceCompletionProvider:ExtensionHostBraceCompletion.registerBraceCompletionProvider,
    executeBraceCompletionProvider: ExtensionHostBraceCompletion.executeBraceCompletionProvider,

    // Completion
    registerCompletionProvider:ExtensionHostCompletion.registerCompletionProvider,
    executeCompletionProvider: ExtensionHostCompletion.executeCompletionProvider,

    // Definition
    registerDefinitionProvider: ExtensionHostDefinition.registerDefinitionProvider,
    executeDefinitionProvider: ExtensionHostDefinition.executeDefinitionProvider,

    // Implementation
    registerImplementationProvider:ExtensionHostImplementation.registerImplementationProvider,
    executeImplementationProvider:ExtensionHostImplementation.executeImplementationProvider,

    // Reference
    registerReferenceProvider:ExtensionHostReference.registerReferenceProvider,
    executeReferenceProvider:ExtensionHostReference.executeReferenceProvider,

    // Tab Completion
    registerTabCompletionProvider: ExtensionHostTabCompletion.registerTabCompletionProvider,
    executeTabCompletionProvider: ExtensionHostTabCompletion.executeTabCompletionProvider,

    // Text Document
    getTextFromTextDocument: TextDocument.getText,

    // Type Definition
    registerTypeDefinitionProvider: ExtensionHostTypeDefinition.registerTypeDefinitionProvider,
    executeTypeDefinitionProvider: ExtensionHostTypeDefinition.executeTypeDefinitionProvider,
  }
}
