import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeCompletionProvider = async (editor, offset) => {
  const ipc = await ExtensionHostManagement.activateByEvent(
    `onCompletion:${editor.languageId}`
  )
  return ExtensionHost.invoke(
    /* ipc */ ipc,
    /* ExtensionHostCompletion.execute */ 'ExtensionHostCompletion.execute',
    /* textDocumentId */ editor.id,
    /* offset */ offset
  )
}
