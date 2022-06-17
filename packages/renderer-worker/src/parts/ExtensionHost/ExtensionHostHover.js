import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeHoverProvider = async (editor, offset) => {
  await ExtensionHostManagement.activateByEvent(`onHover:${editor.languageId}`)
  return ExtensionHost.invoke(
    /* ExtensionHostHover.execute */ 'ExtensionHostHover.execute',
    /* documentId */ editor.id,
    /* offset */ offset
  )
}
