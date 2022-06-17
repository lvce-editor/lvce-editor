import * as Editor from '../Editor/Editor.js'
import * as EditorGetSelectionFromNativeRange from './EditorCommandGetSelectionFromNativeRange.js'

export const editorHandleNativeSelectionChange = (editor, range) => {
  const selection =
    EditorGetSelectionFromNativeRange.getSelectionFromNativeRange(editor, range)
  const selections = [selection]
  return Editor.scheduleSelections(editor, selections)
}
