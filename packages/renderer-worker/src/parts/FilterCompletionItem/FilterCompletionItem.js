// based on https://github.com/microsoft/vscode/blob/3059063b805ed0ac10a6d9539e213386bfcfb852/src/vs/base/common/filters.ts by Microsoft (License MIT)

const Arrow = {
  Diagonal: 1,
  Left: 2,
}

const gridSize = 128

const createTable = (size) => {
  const table = []
  for (let i = 0; i < size; i++) {
    const row = []
    for (let j = 0; j < size; j++) {
      row.push(0)
    }
    table.push(row)
  }
  return table
}

const table = createTable(gridSize)
const arrows = createTable(gridSize)
const diag = createTable()

const getScore = (rowChar, columnChar) => {
  return rowChar === columnChar ? 7 : -1
}

const isPatternInWord = (patternLow, patternPos, patternLen, wordLow, wordPos, wordLen) => {
  while (patternPos < patternLen && wordPos < wordLen) {
    if (patternLow[patternPos] === wordLow[wordPos]) {
      patternPos += 1
    }
    wordPos += 1
  }
  return patternPos === patternLen // pattern must be exhausted
}

const traceHighlights = (table, arrows, patternLength, wordLength) => {
  let row = patternLength
  let column = wordLength - 1
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

export const Empty = []

export const filterCompletionItem = (pattern, word) => {
  const patternLength = pattern.length
  const wordLength = word.length
  const patternLower = pattern.toLowerCase()
  const wordLower = word.toLowerCase()
  if (!isPatternInWord(patternLower, 0, patternLength, wordLower, 0, wordLength)) {
    return Empty
  }
  for (let row = 1; row < patternLength + 1; row++) {
    const rowChar = pattern[row - 1]
    for (let column = 1; column < wordLength; column++) {
      const columnChar = word[column - 1]
      const score = getScore(rowChar, columnChar)
      const diagonalScore = score + table[row - 1][column - 1]
      const leftScore = table[row][column - 1] + 1
      if (leftScore > diagonalScore) {
        table[row][column] = diagonalScore
        arrows[row][column] = Arrow.Left
      } else {
        table[row][column] = leftScore
        arrows[row][column] = Arrow.Diagonal
      }
    }
  }
  const highlights = traceHighlights(table, arrows, patternLength, wordLength)
  return highlights
}
