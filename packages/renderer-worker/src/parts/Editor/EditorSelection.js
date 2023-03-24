import * as Assert from '../Assert/Assert.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'
import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.js'
import * as NormalizeText from '../NormalizeText/NormalizeText.js'

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

const getX = (line, column, fontWeight, fontSize, fontFamily, letterSpacing, tabSize, halfCursorWidth, width, averageCharWidth, difference) => {
  if (!line) {
    return 0
  }
  Assert.string(line)
  Assert.number(tabSize)
  Assert.number(halfCursorWidth)
  Assert.number(width)
  Assert.number(averageCharWidth)
  Assert.number(difference)
  if (column === 0) {
    return 0
  }
  // TODO support non-monospace font, emoji, tab character, zero width characters
  if (column * averageCharWidth > width) {
    return width
  }
  const normalize = NormalizeText.shouldNormalizeText(line)
  const normalizedLine = NormalizeText.normalizeText(line, normalize, tabSize)
  const partialText = normalizedLine.slice(0, column)
  return MeasureTextWidth.measureTextWidth(partialText, fontWeight, fontSize, fontFamily, letterSpacing) - halfCursorWidth + difference
}

const getY = (row, minLineY, rowHeight) => {
  return (row - minLineY) * rowHeight
}

const getAverageCharWidthOrDefault = (fontWeight, fontSize, fontFamily, letterSpacing) => {
  return MeasureTextWidth.measureTextWidth('a', fontWeight, fontSize, fontFamily, letterSpacing)
}

export const getVisible = (editor) => {
  const visibleCursors = []
  const visibleSelections = []
  // // TODO binary search

  const {
    selections,
    minLineY,
    maxLineY,
    rowHeight,
    lines,
    fontSize,
    fontFamily,
    fontWeight,
    letterSpacing,
    cursorWidth,
    tabSize,
    width,
    differences,
  } = editor
  const averageCharWidth = getAverageCharWidthOrDefault(fontWeight, fontSize, fontFamily, letterSpacing)
  const halfCursorWidth = cursorWidth / 2
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    if (selectionEndRow < minLineY || selectionStartRow > maxLineY) {
      continue
    }
    const relativeEndLineRow = selectionEndRow - minLineY
    const endLineDifference = differences[relativeEndLineRow]
    const endLine = lines[selectionEndRow]
    const endLineEndX = getX(
      endLine,
      selectionEndColumn,
      fontWeight,
      fontSize,
      fontFamily,
      letterSpacing,
      tabSize,
      halfCursorWidth,
      width,
      averageCharWidth,
      endLineDifference
    )
    const endLineY = getY(selectionEndRow, minLineY, rowHeight)
    if (EditorSelection.isEmpty(selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn) && endLineEndX > 0) {
      visibleCursors.push(endLineEndX, endLineY)
      continue
    }
    const startLineY = getY(selectionStartRow, minLineY, rowHeight)
    const startLineYRelative = selectionStartRow - minLineY
    const startLineDifference = differences[startLineYRelative]
    if (selectionStartRow === selectionEndRow) {
      const startX = getX(
        endLine,
        selectionStartColumn,
        fontWeight,
        fontSize,
        fontFamily,
        letterSpacing,
        tabSize,
        halfCursorWidth,
        width,
        averageCharWidth,
        startLineDifference
      )
      if (endLineEndX > 0) {
        visibleCursors.push(endLineEndX, endLineY)
      }
      const selectionWidth = endLineEndX - startX
      visibleSelections.push(startX, startLineY, selectionWidth, rowHeight)
    } else {
      if (selectionStartRow >= minLineY) {
        const startLine = lines[selectionStartRow]
        const startLineStartX = getX(
          startLine,
          selectionStartColumn,
          fontWeight,
          fontSize,
          fontFamily,
          letterSpacing,
          tabSize,
          halfCursorWidth,
          width,
          averageCharWidth,
          startLineDifference
        )
        const startLineEndX = getX(
          startLine,
          startLine.length,
          fontWeight,
          fontSize,
          fontFamily,
          letterSpacing,
          tabSize,
          halfCursorWidth,
          width,
          averageCharWidth,
          startLineDifference
        )
        const startLineStartY = getY(selectionStartRow, minLineY, rowHeight)
        const selectionWidth = startLineEndX - startLineStartX
        visibleSelections.push(startLineStartX, startLineStartY, selectionWidth, rowHeight)
      }
      const iMin = Math.max(selectionStartRow + 1, minLineY)
      const iMax = Math.min(selectionEndRow, maxLineY)
      for (let i = iMin; i < iMax; i++) {
        const currentLine = lines[i]
        const currentLineY = getY(i, minLineY, rowHeight)
        const relativeLine = i - minLineY
        const difference = differences[relativeLine]
        const selectionWidth = getX(
          currentLine,
          currentLine.length,
          fontWeight,
          fontSize,
          fontFamily,
          letterSpacing,
          tabSize,
          halfCursorWidth,
          width,
          averageCharWidth,
          difference
        )
        visibleSelections.push(0, currentLineY, selectionWidth, rowHeight)
      }
      if (selectionEndRow <= maxLineY) {
        const selectionWidth = endLineEndX
        visibleSelections.push(0, endLineY, selectionWidth, rowHeight)
        visibleCursors.push(endLineEndX, endLineY)
      }
    }
  }
  // TODO maybe use Uint32array or Float64Array?
  return {
    cursorInfos: new Float32Array(visibleCursors),
    selectionInfos: new Float32Array(visibleSelections),
  }
}
