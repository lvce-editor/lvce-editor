export const getLineText = (content, startRowIndex, startColumnIndex, endRowIndex, endColumnIndex) => {
  let newLineIndex = 0
  let rowIndex = 0
  while (newLineIndex !== -1) {
    if (rowIndex++ >= startRowIndex) {
      break
    }
    newLineIndex = content.indexOf('\n', newLineIndex)
  }
  const lineText = content.slice(newLineIndex + startColumnIndex, newLineIndex + endColumnIndex)
  return lineText
}
