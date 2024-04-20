import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.js'

export const limitString = (string, limit) => {
  let lines = 0
  let i = 0
  while (i !== -1 && lines < limit) {
    i = GetNewLineIndex.getNewLineIndex(string, i + 1)
    if (i === -1) {
      break
    }
    lines++
  }
  if (i === -1) {
    return string
  }
  return string.slice(0, i)
}
