export const setSelections = (editor: any, selections: any) => {
  const { minLineY, maxLineY, rowHeight } = editor
  const startRowIndex = selections[0]
  if (startRowIndex < minLineY) {
    const deltaY = startRowIndex * rowHeight
    return {
      ...editor,
      minLineY: startRowIndex,
      maxLineY: startRowIndex + 1,
      selections,
      deltaY,
    }
  }
  if (startRowIndex > maxLineY) {
    const deltaY = startRowIndex * rowHeight
    return {
      ...editor,
      minLineY: startRowIndex,
      maxLineY: startRowIndex + 1,
      selections,
      deltaY,
    }
  }
  return {
    ...editor,
    selections,
  }
}
