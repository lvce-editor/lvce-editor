export const getVisible = (editor) => {
  const { selections, minLineY, maxLineY, rowHeight, columnWidth, lines } =
    editor
  const visibleSelections = []
  const visibleCursors = []
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    if (selectionEndRow < minLineY) {
      continue
    }
    if (selectionStartRow > maxLineY) {
      break
    }
    if (selectionStartRow === selectionEndRow) {
      if (selectionStartColumn === selectionEndColumn) {
        const cursorTop = (selectionStartRow - minLineY) * rowHeight
        const cursorLeft = selectionStartColumn * columnWidth
        visibleCursors.push(cursorTop, cursorLeft)
        continue
      }
      const top = (selectionStartRow - minLineY) * rowHeight
      const left = selectionStartColumn * columnWidth
      const width = (selectionEndColumn - selectionStartColumn) * columnWidth
      const height = rowHeight
      visibleSelections.push(
        /* top */ top,
        /* left */ left,
        /* width */ width,
        /* height */ height
      )
      const cursorLeft = selectionEndColumn * columnWidth
      visibleCursors.push(top, cursorLeft)
      continue
    }
    if (selectionStartRow >= minLineY) {
      visibleSelections.push(
        /* top */ (selectionStartRow - minLineY) * rowHeight,
        /*left */ selectionStartColumn * columnWidth,
        /* width */ (lines[selectionStartRow].length - selectionStartColumn) *
          columnWidth,
        /* height */ rowHeight
      )
    }
    const iMin = Math.max(selectionStartRow + 1, minLineY)
    const iMax = Math.min(selectionEndRow, maxLineY)
    for (let i = iMin; i < iMax; i++) {
      visibleSelections.push(
        /* top */ (i - minLineY) * rowHeight,
        /* left */ 0,
        /* width */ lines[i].length * columnWidth,
        /* height */ rowHeight
      )
    }
    if (selectionEndRow <= maxLineY) {
      visibleSelections.push(
        /* top */ (selectionEndRow - minLineY) * rowHeight,
        /* left */ 0,
        /* width */ selectionEndColumn * columnWidth,
        /* height */ rowHeight
      )
    }
  }
  return {
    cursors: new Uint32Array(visibleCursors),
    selections: new Uint32Array(visibleSelections),
  }
}
