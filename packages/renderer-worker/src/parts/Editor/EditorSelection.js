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
  const minLineY = editor.minLineY
  const maxLineY = editor.maxLineY
  const rowHeight = editor.rowHeight
  const columnWidth = editor.columnWidth
  const lines = editor.lines
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]

    if (selectionEndRow < minLineY) {
      continue
    }
    if (selectionStartRow > maxLineY) {
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
      visibleSelections.push(
        /* top */ (selectionStartRow - minLineY) * rowHeight,
        /* left */ selectionStartColumn * columnWidth,
        /* width */ (selectionEndColumn - selectionStartColumn) * columnWidth,
        /* height */ rowHeight
      )
    } else {
      if (selectionStartRow >= minLineY) {
        visibleSelections.push(
          /* top */ (selectionStartRow - minLineY) * rowHeight,
          /*left */ selectionStartColumn * columnWidth,
          /* width */ (lines[selectionStartRow].length - selectionStartColumn) *
            columnWidth,
          /* height */ rowHeight
        )
      }
      const iMin = Math.max(selectionStartRow + 1, minLineY)
      const iMax = Math.min(selectionEndRow, maxLineY)
      for (let i = iMin; i < iMax; i++) {
        visibleSelections.push(
          /* top */ (i - minLineY) * rowHeight,
          /* left */ 0,
          /* width */ lines[i].length * columnWidth,
          /* height */ rowHeight
        )
      }
      if (selectionEndRow <= maxLineY) {
        visibleSelections.push(
          /* top */ (selectionEndRow - minLineY) * rowHeight,
          /* left */ 0,
          /* width */ selectionEndColumn * columnWidth,
          /* height */ rowHeight
        )
      }
    }
  }
  return new Uint32Array(visibleSelections)
}
