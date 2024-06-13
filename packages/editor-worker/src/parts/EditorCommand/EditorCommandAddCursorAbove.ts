// @ts-ignore
const getNewSelections = (selections) => {
  const newSelections: number[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const startRowIndex = selections[i]
    const startColumnIndex = selections[i + 1]
    const endRowIndex = selections[i + 2]
    const endColumnIndex = selections[i + 3]
    if (i === 0 && startRowIndex !== 0) {
      newSelections.push(startRowIndex - 1, startColumnIndex, startRowIndex - 1, startColumnIndex)
    }
    newSelections.push(startRowIndex, startColumnIndex, endRowIndex, endColumnIndex)
  }
  return new Uint32Array(newSelections)
}

// @ts-ignore
export const addCursorAbove = (editor) => {
  const { selections } = editor
  const newSelections = getNewSelections(selections)
  return {
    ...editor,
    selections: newSelections,
  }
}
