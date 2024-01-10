import * as Character from '../Character/Character.js'
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
  if (content[newLineIndex] === Character.NewLine) {
    newLineIndex++
  }
  let nextIndex = GetNewLineIndex.getNewLineIndex(content, newLineIndex)
  if (nextIndex === -1) {
    nextIndex = content.length
  }
  const lineText = content.slice(newLineIndex, nextIndex)
  return lineText
}
