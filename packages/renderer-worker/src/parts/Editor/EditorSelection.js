import * as Assert from '../Assert/Assert.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.js'
import * as Px from '../Px/Px.js'
import * as GetX from '../GetX/GetX.js'

const getSelectionFromChange = (change) => {
  // @ts-ignore
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

const emptyCursors = []

const getCursorArray = (visibleCursors, isFocused) => {
  if (!isFocused) {
    return emptyCursors
  }
  const cursorArray = []
  for (let i = 0; i < visibleCursors.length; i += 2) {
    const x = visibleCursors[i]
    const y = visibleCursors[i + 1]
    cursorArray.push(`${Px.px(x)} ${Px.px(y)}`)
  }
  return cursorArray
}

const getSelectionArray = (visibleSelections) => {
  const selectionsArray = []
  for (let i = 0; i < visibleSelections.length; i += 4) {
    const x = visibleSelections[i]
    const y = visibleSelections[i + 1]
    const width = visibleSelections[i + 2]
    const height = visibleSelections[i + 3]
    selectionsArray.push(Px.px(x), Px.px(y), Px.px(width), Px.px(height))
  }
  return selectionsArray
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
    focused,
    charWidth,
    isMonospaceFont,
  } = editor

  const averageCharWidth = charWidth
  const halfCursorWidth = cursorWidth / 2
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn, reversed] = GetSelectionPairs.getSelectionPairs(
      selections,
      i,
    )
    if (selectionEndRow < minLineY || selectionStartRow > maxLineY) {
      continue
    }
    const relativeEndLineRow = selectionEndRow - minLineY
    const endLineDifference = differences[relativeEndLineRow]
    const endLine = lines[selectionEndRow]
    const endLineEndX = GetX.getX(
      endLine,
      selectionEndColumn,
      fontWeight,
      fontSize,
      fontFamily,
      isMonospaceFont,
      letterSpacing,
      tabSize,
      halfCursorWidth,
      width,
      averageCharWidth,
      endLineDifference,
    )
    const endLineY = GetX.getY(selectionEndRow, minLineY, rowHeight)
    if (EditorSelection.isEmpty(selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn) && endLineEndX > 0) {
      visibleCursors.push(endLineEndX, endLineY)
      continue
    }
    const startLineY = GetX.getY(selectionStartRow, minLineY, rowHeight)
    const startLineYRelative = selectionStartRow - minLineY
    const startLineDifference = differences[startLineYRelative]
    if (selectionStartRow === selectionEndRow) {
      const startX = GetX.getX(
        endLine,
        selectionStartColumn,
        fontWeight,
        fontSize,
        fontFamily,
        isMonospaceFont,
        letterSpacing,
        tabSize,
        halfCursorWidth,
        width,
        averageCharWidth,
        startLineDifference,
      )
      if (reversed) {
        visibleCursors.push(startX, endLineY)
      } else if (endLineEndX >= 0) {
        visibleCursors.push(endLineEndX, endLineY)
      }
      const selectionWidth = endLineEndX - startX
      visibleSelections.push(startX, startLineY, selectionWidth, rowHeight)
    } else {
      if (selectionStartRow >= minLineY) {
        const startLine = lines[selectionStartRow]
        const startLineStartX = GetX.getX(
          startLine,
          selectionStartColumn,
          fontWeight,
          fontSize,
          fontFamily,
          isMonospaceFont,
          letterSpacing,
          tabSize,
          halfCursorWidth,
          width,
          averageCharWidth,
          startLineDifference,
        )
        const startLineEndX = GetX.getX(
          startLine,
          startLine.length,
          fontWeight,
          fontSize,
          fontFamily,
          isMonospaceFont,
          letterSpacing,
          tabSize,
          halfCursorWidth,
          width,
          averageCharWidth,
          startLineDifference,
        )
        const startLineStartY = GetX.getY(selectionStartRow, minLineY, rowHeight)
        const selectionWidth = startLineEndX - startLineStartX
        if (reversed) {
          visibleCursors.push(startLineStartX, startLineStartY)
        }
        visibleSelections.push(startLineStartX, startLineStartY, selectionWidth, rowHeight)
      }
      const iMin = Math.max(selectionStartRow + 1, minLineY)
      const iMax = Math.min(selectionEndRow, maxLineY)
      for (let i = iMin; i < iMax; i++) {
        const currentLine = lines[i]
        const currentLineY = GetX.getY(i, minLineY, rowHeight)
        const relativeLine = i - minLineY
        const difference = differences[relativeLine]
        const selectionWidth = GetX.getX(
          currentLine,
          currentLine.length,
          fontWeight,
          fontSize,
          fontFamily,
          isMonospaceFont,
          letterSpacing,
          tabSize,
          halfCursorWidth,
          width,
          averageCharWidth,
          difference,
        )
        visibleSelections.push(0, currentLineY, selectionWidth, rowHeight)
      }
      if (selectionEndRow <= maxLineY) {
        const selectionWidth = endLineEndX
        visibleSelections.push(0, endLineY, selectionWidth, rowHeight)
        if (!reversed) {
          visibleCursors.push(selectionWidth, endLineY)
        }
      }
    }
  }
  // TODO maybe use Uint32array or Float64Array?
  return {
    cursorInfos: getCursorArray(visibleCursors, focused),
    selectionInfos: getSelectionArray(visibleSelections),
  }
}
