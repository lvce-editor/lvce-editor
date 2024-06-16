import * as Assert from '../Assert/Assert.ts'
import * as Clamp from '../Clamp/Clamp.ts'
import * as GetAccurateColumnIndex from '../GetAccurateColumnIndex/GetAccurateColumnIndex.ts'

// @ts-ignore
export const at = (editor, eventX, eventY) => {
  Assert.object(editor)
  Assert.number(eventX)
  Assert.number(eventY)
  const { y, deltaY, rowHeight, fontSize, fontWeight, fontFamily, letterSpacing, lines, tabSize, differences, isMonospaceFont, charWidth } = editor
  const rowIndex = Math.floor((eventY - y + deltaY) / rowHeight)
  if (rowIndex < 0) {
    return {
      rowIndex: 0,
      columnIndex: 0,
    }
  }
  // @ts-ignore
  const difference = differences[rowIndex]
  const clampedRowIndex = Clamp.clamp(rowIndex, 0, lines.length - 1)
  const line = lines[clampedRowIndex]
  const columnIndex = GetAccurateColumnIndex.getAccurateColumnIndex(
    line,
    fontWeight,
    fontSize,
    fontFamily,
    letterSpacing,
    isMonospaceFont,
    charWidth,
    tabSize,
    eventX,
  )
  return {
    rowIndex: clampedRowIndex,
    columnIndex,
  }
}

/**
 * @deprecated this doesn't work for variable width characters (unicode/emoji).
 * Use position computation in renderer process instead
 *
 * @param {object} editor
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @returns
 */
// @ts-ignore
export const x = (editor, rowIndex, columnIndex) => {
  const { columnWidth, x } = editor
  const offsetX = columnIndex * columnWidth + x
  return offsetX
}

// @ts-ignore
export const y = (editor, rowIndex) => {
  const { rowHeight, y } = editor
  const offsetY = (rowIndex + 1) * rowHeight + y
  return offsetY
}
