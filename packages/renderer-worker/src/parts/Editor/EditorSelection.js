import * as Assert from '../Assert/Assert.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'

const getSelectionFromChange = (change) => {
  if (change.inserted.length === 1) {
    const newPosition = {
      rowIndex: change.start.rowIndex + change.inserted.length - 1,
      columnIndex: change.inserted.at(-1).length + change.start.columnIndex,
    }
    return {
      start: newPosition,
      end: newPosition,
    }
  }
  const newPosition = {
    rowIndex: change.start.rowIndex + change.inserted.length - 1,
    columnIndex: change.inserted.at(-1).length,
  }
  return {
    start: newPosition,
    end: newPosition,
  }
}

export const setSelections = (editor, selections) => {
  Assert.object(editor)
  Assert.uint32array(selections)
  return {
    ...editor,
    selections,
  }
  // editor.selections = selections
  // GlobalEventBus.emitEvent('editor.selectionChange', editor, selections)
}

// TODO maybe only accept sorted selection edits in the first place

// TODO avoid allocating too many objects when creating new selection from changes
export const applyEdit = (editor, changes) => {
  Assert.object(editor)
  Assert.array(changes)
  const newSelections = EditorSelection.from(changes, getSelectionFromChange)
  // setSelections(editor, newSelections)
  return newSelections
}
