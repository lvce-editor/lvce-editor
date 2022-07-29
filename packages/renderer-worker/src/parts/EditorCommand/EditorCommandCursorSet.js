import * as Editor from '../Editor/Editor.js'
import * as Assert from '../Assert/Assert.js'

export const editorCursorSet = (editor, position) => {
  Assert.object(editor)
  Assert.object(position)
  const selectionEdits = [
    {
      start: position,
      end: position,
    },
  ]
  return Editor.scheduleSelections(editor, selectionEdits)
}
