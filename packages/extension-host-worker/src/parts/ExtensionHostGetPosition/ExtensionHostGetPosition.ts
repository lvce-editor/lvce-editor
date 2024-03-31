export const getPosition = (textDocument, offset) => {
  let index = 0
  let rowIndex = 0
  let newLineIndex = 0
  const text = textDocument.text
  while (index < offset) {
    newLineIndex = text.indexOf('\n', index)
    if (newLineIndex === -1) {
      break
    }
    const newIndex = newLineIndex + 1
    if (newIndex > offset) {
      break
    }
    index = newIndex
    rowIndex++
  }
  const columnIndex = offset - index
  return {
    rowIndex,
    columnIndex,
  }
}
