import * as Assert from '../Assert/Assert.js'

export const at = (editor, x, y, offset) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  Assert.number(offset)
  const rowIndex = Math.floor(
    (y - editor.top + editor.deltaY) / editor.rowHeight
  )
  const columnIndex = offset
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
 * @param {object} position
 * @returns
 */
export const x = (editor, position) => {
  const x = position.columnIndex * editor.columnWidth + editor.left
  return x
}

export const y = (editor, position) => {
  const y = (position.rowIndex + 1) * editor.rowHeight + editor.top
  return y
}
