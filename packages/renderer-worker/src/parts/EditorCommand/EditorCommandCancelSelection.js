import * as Editor from '../Editor/Editor.js'

export const editorCancelSelection = (editor) => {
  const selection = editor.selections[0]
  if (editor.selections.length === 1 && selection.start === selection.end) {
    return editor
  }
  const selectionEdits = [
    {
      start: selection.start,
      end: selection.start,
    },
  ]
  return Editor.scheduleSelections(editor, selectionEdits)
}
