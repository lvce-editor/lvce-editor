import * as Editor from '../Editor/Editor.js'

export const editorSelectAll = (editor) => {
  const selection = {
    start: {
      rowIndex: 0,
      columnIndex: 0,
    },
    end: {
      rowIndex: editor.lines.length,
      columnIndex: editor.lines.at(-1).length,
    },
  }
  const selectionEdits = [selection]
  return Editor.scheduleSelections(editor, selectionEdits)
}
