const getNewSelections = (selections) => {
  return selections
}

export const addCursorBelow = (editor) => {
  const { selections } = editor
  const newSelections = getNewSelections(selections)
  return {
    ...editor,
    selections: newSelections,
  }
}
