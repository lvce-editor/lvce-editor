// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'

export const state = {
  isComposing: false,
  compositionText: '',
}

// @ts-ignore
export const compositionStart = (editor, event) => {
  state.isComposing = true
  return editor
}

// @ts-ignore
const getCompositionChanges = (selections, data) => {
  const changes: any[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    const startColumnIndex = selectionStartColumn - state.compositionText.length
    changes.push({
      start: {
        rowIndex: selectionStartRow,
        columnIndex: startColumnIndex,
      },
      end: {
        rowIndex: selectionEndRow,
        columnIndex: selectionEndColumn,
      },
      inserted: [data],
      deleted: [state.compositionText],
      origin: EditOrigin.CompositionUpdate,
    })
  }
  return changes
}

// @ts-ignore
export const compositionUpdate = (editor, data) => {
  const selections = editor.selections
  const changes = getCompositionChanges(selections, data)
  state.compositionText = data
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

// @ts-ignore
export const compositionEnd = (editor, data) => {
  const selections = editor.selections
  const changes = getCompositionChanges(selections, data)
  state.isComposing = false
  state.compositionText = ''
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
