import * as Assert from '../Assert/Assert.js'
import * as Platform from '../Platform/Platform.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'

export const applyEdits = (editor, cursor) => {
  // TODO multiple cursors
  console.assert(cursor)
  editor.cursor = cursor
  GlobalEventBus.emitEvent('editor.cursorChange', editor, cursor)
}

const isInRange = (position, min, max) => {
  return position.rowIndex >= min && position.rowIndex <= max
}

const getTokenIndex = (lineCache, selection) => {
  if (!lineCache) {
    // throw new Error('no line cache found')
    return -1
  }
  Assert.object(selection)
  let offset = 0
  for (let i = 0; i < lineCache.tokens.length; i++) {
    const newOffset = offset + lineCache.tokens[i].length
    if (newOffset >= selection.end.columnIndex) {
      return {
        index: i,
        offset: selection.end.columnIndex - offset,
      }
    }
    offset = newOffset
  }
  console.warn(`token at columnIndex ${selection.end.columnIndex} not found`)
  return {
    index: -1,
    offset: -1,
  }
}

export const getVisible = (editor) => {
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
  for (const selection of editor.selections) {
    if (isInRange(selection.end, editor.minLineY, editor.maxLineY)) {
      const lineCache = editor.lineCache[selection.end.rowIndex + 1]
      if (!lineCache) {
        console.log('line caches', editor, editor.lineCache)
      }
      const tokenIndex = getTokenIndex(lineCache, selection)
      visibleCursors.push({
        top: (selection.end.rowIndex - editor.minLineY) * editor.rowHeight,
        topIndex: selection.end.rowIndex - editor.minLineY,
        leftIndex: tokenIndex.index,
        remainingOffset: tokenIndex.offset,
      })
    }
  }
  return visibleCursors
}
