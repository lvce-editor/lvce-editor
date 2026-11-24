import * as GetActiveEditor from './GetActiveEditor.js'

export const name = 'GetActiveEditor'

export const Commands = {
  getOpenTextDocument: GetActiveEditor.getOpenTextDocument,
  applyOpenTextDocumentEdit: GetActiveEditor.applyOpenTextDocumentEdit,
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
  refreshLanguageServerDiagnostics: GetActiveEditor.refreshLanguageServerDiagnostics,
  updateAllDiagnostics: GetActiveEditor.updateAllDiagnostics,
  updateDiagnostics: GetActiveEditor.updateDiagnostics,
}
