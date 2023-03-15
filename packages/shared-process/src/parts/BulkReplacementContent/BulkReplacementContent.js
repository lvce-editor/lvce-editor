import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.js'

export const getNewContent = (content, ranges, replacement) => {
  if (ranges.length === 0) {
    return content
  }
  let rowIndex = 0
  let newLineIndex = -1
  let copiedContentIndex = 0
  let newContent = ''
  let previousNewLineIndex = -1
  for (let i = 0; i < ranges.length; i += 4) {
    while (rowIndex < ranges[i]) {
      previousNewLineIndex = newLineIndex
      newLineIndex = GetNewLineIndex.getNewLineIndex(content, newLineIndex + 1)
      rowIndex++
    }
    const startRowIndex = ranges[i]
    const startColumnIndex = ranges[i + 1]
    const endRowIndex = ranges[i + 2]
    const endColumnIndex = ranges[i + 3]
    if (copiedContentIndex <= newLineIndex) {
      newContent += content.slice(copiedContentIndex, newLineIndex + 1)
      copiedContentIndex = newLineIndex + 1
    }
    newContent += replacement
    copiedContentIndex += endColumnIndex - startColumnIndex
  }
  return newContent
}
