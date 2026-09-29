import * as GetActiveEditor from './GetActiveEditor.js'

export const name = 'GetActiveEditor'

export const Commands = {
  getActiveEditorId: GetActiveEditor.getActiveEditorId,
  getDiagnostics: GetActiveEditor.getDiagnostics,
  getOpenEditorUris: GetActiveEditor.getOpenEditorUris,
  getSelections: GetActiveEditor.getSelections,
  getTextDocument: GetActiveEditor.getTextDocument,
  setSelections: GetActiveEditor.setSelections,
  updateAllDiagnostics: GetActiveEditor.updateAllDiagnostics,
  updateDiagnostics: GetActiveEditor.updateDiagnostics,
}
