import * as GetActiveEditor from './GetActiveEditor.js'

export const name = 'GetActiveEditor'

export const Commands = {
  getActiveEditorInfo: GetActiveEditor.getActiveEditorInfo,
  openColorPicker: GetActiveEditor.openColorPicker,
  getActiveEditorId: GetActiveEditor.getActiveEditorId,
  getActiveUri: GetActiveEditor.getActiveUri,
  getDiagnostics: GetActiveEditor.getDiagnostics,
  getOpenEditorUris: GetActiveEditor.getOpenEditorUris,
  getVisibleEditorUris: GetActiveEditor.getVisibleEditorUris,
  getSelections: GetActiveEditor.getSelections,
  getTextDocument: GetActiveEditor.getTextDocument,
  setSelections: GetActiveEditor.setSelections,
  updateAllDiagnostics: GetActiveEditor.updateAllDiagnostics,
  updateDiagnostics: GetActiveEditor.updateDiagnostics,
}
