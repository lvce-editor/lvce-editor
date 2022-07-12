import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeHoverProvider = async (editor, offset) => {
  const extensionHost = await ExtensionHostManagement.activateByEvent(
    `onHover:${editor.languageId}`
  )
  return extensionHost.invoke(
    /* ExtensionHostHover.execute */ 'ExtensionHostHover.execute',
    /* documentId */ editor.id,
    /* offset */ offset
  )
}
