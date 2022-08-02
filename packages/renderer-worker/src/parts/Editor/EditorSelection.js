import * as Assert from '../Assert/Assert.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
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

// TODO visible selections could also be uint16array
// [top1, left1, width1, height1, top2, left2, width2, height2...]

export const getVisible = (editor) => {
  const visibleSelections = []
  // // TODO binary search

  // // after
  const selections = editor.selections
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]

    if (selectionEndRow < editor.minLineY) {
      continue
    }
    if (selectionStartRow > editor.maxLineY) {
      break
    }
    if (
      EditorSelection.isEmpty(
        selectionStartRow,
        selectionStartColumn,
        selectionEndRow,
        selectionEndColumn
      )
    ) {
      continue
    }
    if (selectionStartRow === selectionEndRow) {
      visibleSelections.push({
        top: (selectionStartRow - editor.minLineY) * editor.rowHeight,
        left: selectionStartColumn * editor.columnWidth,
        width: (selectionEndColumn - selectionStartColumn) * editor.columnWidth,
        height: editor.rowHeight,
      })
    } else {
      if (selectionStartRow >= editor.minLineY) {
        visibleSelections.push({
          top: (selectionStartRow - editor.minLineY) * editor.rowHeight,
          left: selectionStartColumn * editor.columnWidth,
          width:
            (editor.lines[selectionStartRow].length - selectionStartColumn) *
            editor.columnWidth,
          height: editor.rowHeight,
        })
      }
      for (
        let i = Math.max(selectionStartRow + 1, editor.minLineY);
        i < Math.min(selectionEndRow, editor.maxLineY);
        i++
      ) {
        visibleSelections.push({
          top: (i - editor.minLineY) * editor.rowHeight,
          left: 0,
          width: editor.lines[i].length * editor.columnWidth,
          height: editor.rowHeight,
        })
      }
      if (selectionEndRow <= editor.maxLineY) {
        visibleSelections.push({
          top: (selectionEndRow - editor.minLineY) * editor.rowHeight,
          left: 0,
          width: selectionEndColumn * editor.columnWidth,
          height: editor.rowHeight,
        })
      }
    }
  }
  return visibleSelections
}
