import * as Assert from '../Assert/Assert.js'
import * as Platform from '../Platform/Platform.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'

export const applyEdits = (editor, cursor) => {
  // TODO multiple cursors
  console.assert(cursor)
  editor.cursor = cursor
  GlobalEventBus.emitEvent('editor.cursorChange', editor, cursor)
}

const isInRange = (rowIndex, min, max) => {
  return rowIndex >= min && rowIndex <= max
}

const getTokenIndex = (lineCache, endColumnIndex) => {
  if (!lineCache) {
    // throw new Error('no line cache found')
    return {
      index: -1,
      offset: -1,
    }
  }
  Assert.number(endColumnIndex)
  let offset = 0
  for (let i = 0; i < lineCache.tokens.length; i++) {
    const newOffset = offset + lineCache.tokens[i].length
    if (newOffset >= endColumnIndex) {
      return {
        index: i,
        offset: endColumnIndex - offset,
      }
    }
    offset = newOffset
  }
  console.warn(`token at columnIndex ${endColumnIndex} not found`)
  return {
    index: -1,
    offset: -1,
  }
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
  const selections = editor.selections
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    if (isInRange(selectionEndRow, editor.minLineY, editor.maxLineY)) {
      const lineCache = editor.lineCache[selectionEndRow + 1]
      if (!lineCache) {
        console.log('line caches', editor, editor.lineCache)
      }
      const tokenIndex = getTokenIndex(lineCache, selectionEndColumn)
      // TODO maybe don't allocate object here, push numbers to flat array instead
      visibleCursors.push({
        top: (selectionEndRow - editor.minLineY) * editor.rowHeight,
        topIndex: selectionEndRow - editor.minLineY,
        leftIndex: tokenIndex.index,
        remainingOffset: tokenIndex.offset,
      })
    }
  }
  return visibleCursors
}
