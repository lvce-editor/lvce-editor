import * as Editor from '../Editor/Editor.js'

export const editorCursorSet = (editor, position) => {
  const selectionEdits = [
    {
      start: position,
      end: position,
    },
  ]
  return Editor.scheduleSelections(editor, selectionEdits)
}
