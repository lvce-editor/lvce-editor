import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeSemanticTokenProvider = async (editor) => {
  await ExtensionHostManagement.activateByEvent(
    `onSemanticTokens:${editor.languageId}`
  )
  return ExtensionHost.invoke(
    /* ExtensionHostSemanticTokens.execute */ 'ExtensionHostSemanticTokens.executeSemanticTokenProvider',
    /* textDocumentId */ editor.id
  )
}
