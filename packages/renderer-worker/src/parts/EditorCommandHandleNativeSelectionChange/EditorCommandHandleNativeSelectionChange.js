import * as Editor from '../Editor/Editor.js'
import * as EditorGetSelectionFromNativeRange from '../EditorCommandGetSelectionFromNativeRange/EditorCommandGetSelectionFromNativeRange.js'

export const editorHandleNativeSelectionChange = (editor, range) => {
  const selections =
    EditorGetSelectionFromNativeRange.getSelectionFromNativeRange(editor, range)
  return Editor.scheduleSelections(editor, selections)
}
