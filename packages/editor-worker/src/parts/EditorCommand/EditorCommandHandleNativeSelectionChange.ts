// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
import * as EditorGetSelectionFromNativeRange from './EditorCommandGetSelectionFromNativeRange.ts'

export const editorHandleNativeSelectionChange = (editor, range) => {
  const selections = EditorGetSelectionFromNativeRange.getSelectionFromNativeRange(editor, range)
  return Editor.scheduleSelections(editor, selections)
}
