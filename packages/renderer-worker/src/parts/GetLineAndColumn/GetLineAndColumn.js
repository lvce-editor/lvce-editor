import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.js'

export const getLineAndColumn = (text, start, end) => {
  let index = -1
  let line = 0
  const column = 0
  while ((index = GetNewLineIndex.getNewLineIndex(text, index + 1)) !== -1) {
    line++
    if (index >= start) {
      break
    }
  }
  return {
    line,
    column,
  }
}
