import * as Platform from '../Platform/Platform.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeSemanticTokenProvider = async (editor) => {
  if (Platform.getPlatform() === 'web') {
    return []
  }
  const extensionHost = await ExtensionHostManagement.activateByEvent(
    `onSemanticTokens:${editor.languageId}`
  )
  return extensionHost.invoke(
    /* ExtensionHostSemanticTokens.execute */ 'ExtensionHostSemanticTokens.executeSemanticTokenProvider',
    /* textDocumentId */ editor.id
  )
}
