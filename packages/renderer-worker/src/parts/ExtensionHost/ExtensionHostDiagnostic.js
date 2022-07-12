import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeDiagnosticProvider = async (editor) => {
  const extensionHost = await ExtensionHostManagement.activateByEvent(
    `onDiagnostic:${editor.languageId}`
  )
  const diagnostics = await extensionHost.invoke(
    /* ExtensionHost.executeDiagnosticProvider */ 'ExtensionHost.executeDiagnosticProvider',
    /* documentId */ editor.id
  )
  Assert.array(diagnostics)
  return diagnostics
}
