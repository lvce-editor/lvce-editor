const getNewSelections = (selections, linesLength) => {
  const newSelections: number[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const startRowIndex = selections[i]
    const startColumnIndex = selections[i + 1]
    const endRowIndex = selections[i + 2]
    const endColumnIndex = selections[i + 3]
    newSelections.push(startRowIndex, startColumnIndex, endRowIndex, endColumnIndex)
    if (i === selections.length - 4 && endRowIndex < linesLength) {
      newSelections.push(endRowIndex + 1, endColumnIndex, endRowIndex + 1, endColumnIndex)
    }
  }
  return new Uint32Array(newSelections)
}

export const addCursorBelow = (editor) => {
  const { selections, lines } = editor
  const newSelections = getNewSelections(selections, lines.length)
  return {
    ...editor,
    selections: newSelections,
  }
}
