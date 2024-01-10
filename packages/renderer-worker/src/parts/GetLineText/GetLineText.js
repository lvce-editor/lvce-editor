import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.js'

export const getLineText = (content, startRowIndex, startColumnIndex, endRowIndex, endColumnIndex) => {
  let newLineIndex = 0
  let rowIndex = 0
  while (newLineIndex !== -1) {
    if (rowIndex++ >= startRowIndex) {
      break
    }
    newLineIndex = GetNewLineIndex.getNewLineIndex(content, newLineIndex + 1)
  }
  if (content[newLineIndex] === '\n') {
    newLineIndex++
  }
  const lineText = content.slice(newLineIndex + startColumnIndex, newLineIndex + endColumnIndex)
  return lineText
}
