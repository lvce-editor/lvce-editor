export const setSelections = (editor, selections) => {
  const { minLineY, maxLineY } = editor
  const startRowIndex = selections[0]
  if (startRowIndex < minLineY) {
    return {
      ...editor,
      minLineY: startRowIndex,
      maxLineY: startRowIndex + 1,
      selections,
    }
  }
  if (startRowIndex > maxLineY) {
    return {
      ...editor,
      minLineY: startRowIndex,
      maxLineY: startRowIndex + 1,
      selections,
    }
  }
  return {
    ...editor,
    selections,
  }
}
