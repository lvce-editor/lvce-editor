// based on https://github.com/microsoft/vscode/blob/3059063b805ed0ac10a6d9539e213386bfcfb852/src/vs/base/common/filters.ts by Microsoft (License MIT)
import * as Arrow from '../Arrow/Arrow.js'

export const traceHighlights = (table, arrows, patternLength, wordLength) => {
  let row = patternLength
  let column = wordLength
  const matches = []
  while (row >= 1 && column >= 1) {
    const arrow = arrows[row][column]
    if (arrow === Arrow.Left) {
      column--
    }
    if (arrow === Arrow.Diagonal) {
      row--
      column--
      const start = column + 1
      while (row >= 1 && column >= 1) {
        const arrow = arrows[row][column]
        if (arrow === Arrow.Left) {
          break
        }
        if (arrow === Arrow.Diagonal) {
          row--
          column--
        }
      }
      const end = column
      matches.unshift(end, start)
    }
  }
  matches.unshift(table[patternLength][wordLength - 1])
  return matches
}
