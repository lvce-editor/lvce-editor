import * as Assert from '../Assert/Assert.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'
import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.js'

const getSelectionFromChange = (change) => {
  const { start, inserted, end } = change
  const startRowIndex = start.rowIndex
  const startColumnIndex = start.columnIndex
  const insertedLength = inserted.length
  if (insertedLength === 1) {
    const newPosition = {
      rowIndex: startRowIndex + insertedLength - 1,
      columnIndex: inserted.at(-1).length + startColumnIndex,
    }
    return {
      start: newPosition,
      end: newPosition,
    }
  }
  const newPosition = {
    rowIndex: startRowIndex + insertedLength - 1,
    columnIndex: inserted.at(-1).length,
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

const isInRange = (rowIndex, min, max) => {
  return rowIndex >= min && rowIndex <= max
}

const getX = (line, column, fontWeight, fontSize, fontFamily, letterSpacing) => {
  if (column === 0) {
    return 0
  }
  const partialText = line.slice(0, column)
  return MeasureTextWidth.measureTextWidth(partialText, fontWeight, fontSize, fontFamily, letterSpacing) - 1
}

const getY = (row, minLineY, rowHeight) => {
  return (row - minLineY) * rowHeight
}

export const getVisible = (editor) => {
  const visibleCursors = []
  const visibleSelections = []
  // // TODO binary search

  const { selections, minLineY, maxLineY, rowHeight, lines, fontSize, fontFamily, fontWeight, letterSpacing } = editor
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    if (isInRange(selectionEndRow, minLineY, maxLineY)) {
      const endLine = lines[selectionEndRow]
      const endLineEndX = getX(endLine, selectionEndColumn, fontWeight, fontSize, fontFamily, letterSpacing)
      const endLineEndY = getY(selectionEndRow, minLineY, rowHeight)
      if (EditorSelection.isEmpty(selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn)) {
        visibleCursors.push(endLineEndX, endLineEndY)
        continue
      }
      const endLineStartX = getX(endLine, selectionStartColumn, fontWeight, fontSize, fontFamily, letterSpacing)
      const endLineStartY = getY(selectionStartRow, minLineY, rowHeight)
      if (selectionStartRow === selectionEndRow) {
        visibleCursors.push(endLineEndX, endLineEndY)
        const width = endLineEndX - endLineStartX
        visibleSelections.push(endLineStartX, endLineStartY, width, rowHeight)
      } else {
        if (selectionStartRow >= minLineY) {
          visibleCursors.push(endLineStartX, endLineStartY)
          const startLine = lines[selectionStartRow]
          const startLineStartX = getX(startLine, selectionStartColumn, fontWeight, fontSize, fontFamily, letterSpacing)
          const startLineEndX = getX(startLine, startLine.length, fontWeight, fontSize, fontFamily, letterSpacing)
          const startLineStartY = getY(selectionStartRow, minLineY, rowHeight)
          const width = startLineEndX - startLineStartX
          visibleSelections.push(startLineStartX, startLineStartY, width, rowHeight)
        }
        const iMin = Math.max(selectionStartRow + 1, minLineY)
        const iMax = Math.min(selectionEndRow, maxLineY)
        for (let i = iMin; i < iMax; i++) {
          const currentLine = lines[i]
          const currentLineY = getY(i, minLineY, rowHeight)
          const width = getX(currentLine, currentLine.length, fontWeight, fontSize, fontFamily, letterSpacing)
          visibleSelections.push(0, currentLineY, width, rowHeight)
        }
        if (selectionEndRow <= maxLineY) {
          const width = endLineEndX - endLineStartX
          visibleSelections.push(endLineStartX, endLineStartY, width, rowHeight)
        }
      }
    }
  }
  // TODO maybe use Uint32array or Float64Array?
  return {
    cursorInfos: new Float32Array(visibleCursors),
    selectionInfos: new Float32Array(visibleSelections),
  }
}
