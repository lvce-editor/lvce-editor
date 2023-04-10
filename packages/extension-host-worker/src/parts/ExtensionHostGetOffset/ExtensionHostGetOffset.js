export const getOffset = (textDocument, position) => {
  let offset = 0
  let rowIndex = 0
  while (rowIndex++ < position.rowIndex) {
    const newLineIndex = textDocument.text.indexOf('\n', offset)
    offset = newLineIndex + 1
  }
  offset += position.columnIndex
  return offset
}
