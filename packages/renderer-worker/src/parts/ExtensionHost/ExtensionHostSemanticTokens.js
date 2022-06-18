import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'
import * as Platform from '../Platform/Platform.js'

export const executeSemanticTokenProvider = async (editor) => {
  if (Platform.getPlatform() === 'web') {
    return []
  }
  await ExtensionHostManagement.activateByEvent(
    `onSemanticTokens:${editor.languageId}`
  )
  return ExtensionHost.invoke(
    /* ExtensionHostSemanticTokens.execute */ 'ExtensionHostSemanticTokens.executeSemanticTokenProvider',
    /* textDocumentId */ editor.id
  )
}
