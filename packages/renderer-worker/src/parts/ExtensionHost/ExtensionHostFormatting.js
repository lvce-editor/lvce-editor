import * as ExtensionHost from '../ExtensionHost/ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeFormattingProvider = async (editor) => {
  await ExtensionHostManagement.activateByEvent(
    `onFormatting:${editor.languageId}`
  )
  return ExtensionHost.invoke(
    /* ExtensionHost.format */ 'ExtensionHost.format',
    /* textDocumentId */ editor.id
  )
}
