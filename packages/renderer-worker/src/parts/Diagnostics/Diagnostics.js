import * as ViewletModuleId from '../../../../renderer-process/src/parts/ViewletModuleId/ViewletModuleId.js'
import * as ExtensionHostDiagnostic from '../ExtensionHost/ExtensionHostDiagnostic.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const getDiagnostics = async () => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText)
  if (!instance) {
    return []
  }
  const editor = instance.state
  const diagnostics = await ExtensionHostDiagnostic.executeDiagnosticProvider(
    editor
  )
  if (!diagnostics) {
    return []
  }
  return diagnostics
}
