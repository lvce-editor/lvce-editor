import * as Assert from '../Assert/Assert.js'
import * as Clamp from '../Clamp/Clamp.js'
import * as GetAccurateColumnIndex from '../GetAccurateColumnIndex/GetAccurateColumnIndex.js'

export const at = (editor, eventX, eventY) => {
  Assert.object(editor)
  Assert.number(eventX)
  Assert.number(eventY)
  const { maxLineY, y, deltaY, rowHeight, fontSize, fontWeight, fontFamily, letterSpacing, lines } = editor
  const rowIndex = Clamp.clamp(Math.floor((eventY - y + deltaY) / rowHeight), 0, maxLineY - 1)
  const line = lines[rowIndex]
  const columnIndex = GetAccurateColumnIndex.getAccurateColumnIndex(line, fontWeight, fontSize, fontFamily, letterSpacing, eventX)
  return {
    rowIndex,
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
export const x = (editor, rowIndex, columnIndex) => {
  const x = columnIndex * editor.columnWidth + editor.x
  return x
}

export const y = (editor, rowIndex, columnIndex) => {
  const y = (rowIndex + 1) * editor.rowHeight + editor.y
  return y
}
