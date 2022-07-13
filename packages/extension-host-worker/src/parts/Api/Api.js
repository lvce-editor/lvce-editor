import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.js'
import * as ExtensionHostReference from '../ExtensionHostReference/ExtensionHostReference.js'
import * as ExtensionHostTextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import * as ExtensionHostTypeDefinition from '../ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.js'
import * as ExtensionHostBraceCompletion from '../ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.js'

export const create = () => {
  // prettier-ignore
  return  {
    ...ExtensionHostBraceCompletion.createApi(),
    // Completion
    ...ExtensionHostCompletion.createApi(),

    // References
    ...ExtensionHostReference.createApi(),


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
    ...ExtensionHostTypeDefinition.createApi(),
  }
}
