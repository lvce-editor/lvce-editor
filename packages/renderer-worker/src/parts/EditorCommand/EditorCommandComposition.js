import * as Editor from '../Editor/Editor.js'

export const state = {
  isComposing: false,
  compositionText: '',
}

export const editorCompositionStart = (editor, event) => {
  state.isComposing = true
  return editor
}

const getCompositionChanges = (editor, data) => {
  const changes = []
  for (const selection of editor.selections) {
    const startRowIndex = selection.start.rowIndex
    const startColumnIndex =
      selection.start.columnIndex - state.compositionText.length
    changes.push({
      start: {
        rowIndex: startRowIndex,
        columnIndex: startColumnIndex,
      },
      end: selection.end,
      inserted: [data],
      deleted: [state.compositionText],
      origin: 'compositionUpdate',
    })
  }
  return changes
}

export const editorCompositionUpdate = (editor, data) => {
  const changes = getCompositionChanges(editor, data)
  console.log('composition update', { changes })
  state.compositionText = data
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

export const editorCompositionEnd = (editor, data) => {
  const changes = getCompositionChanges(editor, data)
  console.log('composition end', { changes })
  state.isComposing = false
  state.compositionText = ''
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
