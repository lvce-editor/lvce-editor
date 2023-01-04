import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.js'
import * as Platform from '../Platform/Platform.js'

export const applyEdits = (editor, cursor) => {
  // TODO multiple cursors
  console.assert(cursor)
  editor.cursor = cursor
  GlobalEventBus.emitEvent('editor.cursorChange', editor, cursor)
}

const isInRange = (rowIndex, min, max) => {
  return rowIndex >= min && rowIndex <= max
}

export const getVisible = (editor) => {
  if (!editor.focused) {
    return []
  }
  if (Platform.isMobileOrTablet()) {
    const visibleCursors = []
    for (const selection of editor.selections) {
      if (isInRange(selection.end, editor.minLineY, editor.maxLineY)) {
        visibleCursors.push({
          rowIndex: selection.end.rowIndex - editor.minLineY,
          columnIndex: selection.end.columnIndex,
        })
      } else {
      }
    }
    return visibleCursors
  }
  // TODO could use uint16array here
  // TODO handle case when text segmenter not supported
  const visibleCursors = []
  const { selections, minLineY, maxLineY, rowHeight, lines, fontSize, fontFamily, fontWeight, letterSpacing } = editor
  const selectionLength = selections.length
  for (let i = 0; i < selectionLength; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    if (isInRange(selectionEndRow, minLineY, maxLineY)) {
      // TODO decide whether to use selection start or selection end for cursor
      // TODO maybe use float32 array instead
      const line = lines[selectionEndRow]
      const partialText = line.slice(0, selectionEndColumn)
      // TODO reuse same text measurements for selections and cursors
      // TODO when font is monospace and ascii, could just multiply selectionEndColumn by charWidth to get offset
      const left = selectionEndColumn === 0 ? 0 : MeasureTextWidth.measureTextWidth(partialText, fontWeight, fontSize, fontFamily, letterSpacing) - 1
      const top = (selectionEndRow - minLineY) * rowHeight
      visibleCursors.push(top, left)
    }
  }
  return visibleCursors
}
