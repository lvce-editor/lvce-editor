import * as ExtensionHost from '../ExtensionHost/ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeFormattingProvider = async (editor) => {
  const ipc = await ExtensionHostManagement.activateByEvent(
    `onFormatting:${editor.languageId}`
  )
  return ExtensionHost.invoke(
    /* ipc */ ipc,
    /* ExtensionHost.format */ 'ExtensionHost.format',
    /* textDocumentId */ editor.id
  )
}
