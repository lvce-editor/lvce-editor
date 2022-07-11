import * as Assert from '../Assert/Assert.js'
import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeDiagnosticProvider = async (editor) => {
  const ipc = await ExtensionHostManagement.activateByEvent(
    `onDiagnostic:${editor.languageId}`
  )
  const diagnostics = await ExtensionHost.invoke(
    /* ipc */ ipc,
    /* ExtensionHost.executeDiagnosticProvider */ 'ExtensionHost.executeDiagnosticProvider',
    /* documentId */ editor.id
  )
  Assert.array(diagnostics)
  return diagnostics
}
