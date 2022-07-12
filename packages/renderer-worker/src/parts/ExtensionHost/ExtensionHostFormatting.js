import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeFormattingProvider = async (editor) => {
  const extensionHost = await ExtensionHostManagement.activateByEvent(
    `onFormatting:${editor.languageId}`
  )
  return extensionHost.invoke(
    /* ExtensionHost.format */ 'ExtensionHost.format',
    /* textDocumentId */ editor.id
  )
}
