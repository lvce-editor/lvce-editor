import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.js'
import * as ExtensionHostReference from '../ExtensionHostReference/ExtensionHostReference.js'
import * as ExtensionHostTextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import * as ExtensionHostTypeDefinition from '../ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.js'

// prettier-ignore
export const vscode = {

  // Completion
  executeCompletionProvider: ExtensionHostCompletion.executeCompletionProvider,
  registerCompletionProvider: ExtensionHostCompletion.registerCompletionProvider,
  unregisterCompletionProvider: ExtensionHostCompletion.unregisterCompletionProvider,


  // References
  registerReferenceProvider: ExtensionHostReference.registerReferenceProvider,
  executeReferenceProvider: ExtensionHostReference.executeReferenceProvider,


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
  executeTypeDefinitionProvider: ExtensionHostTypeDefinition.executeTypeDefinitionProvider
}
