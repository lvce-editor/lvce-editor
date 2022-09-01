import * as Assert from '../Assert/Assert.js'

export const at = (editor, x, y) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  const rowIndex = Math.max(
    Math.floor((y - editor.top + editor.deltaY) / editor.rowHeight),
    0
  )
  const columnIndex = Math.max((x - editor.left) / editor.columnWidth, 0)
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
  const x = columnIndex * editor.columnWidth + editor.left
  return x
}

export const y = (editor, rowIndex, columnIndex) => {
  const y = (rowIndex + 1) * editor.rowHeight + editor.top
  return y
}
