import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeCompletionProvider = async (editor, offset) => {
  const extensionHost = await ExtensionHostManagement.activateByEvent(
    `onCompletion:${editor.languageId}`
  )
  return extensionHost.invoke(
    /* ExtensionHostCompletion.execute */ 'ExtensionHostCompletion.execute',
    /* textDocumentId */ editor.id,
    /* offset */ offset
  )
}
