import * as GetActiveEditor from './GetActiveEditor.js'

export const name = 'GetActiveEditor'

export const Commands = {
  getActiveEditorId: GetActiveEditor.getActiveEditorId,
  getOpenEditorUris: GetActiveEditor.getOpenEditorUris,
  updateAllDiagnostics: GetActiveEditor.updateAllDiagnostics,
  updateDiagnostics: GetActiveEditor.updateDiagnostics,
}
