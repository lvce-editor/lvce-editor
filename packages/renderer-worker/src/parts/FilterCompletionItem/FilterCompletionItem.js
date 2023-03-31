// based on https://github.com/microsoft/vscode/blob/3059063b805ed0ac10a6d9539e213386bfcfb852/src/vs/base/common/filters.ts by Microsoft (License MIT)
import * as PrintTable from '../PrintTable/PrintTable.js'
import * as Arrow from '../Arrow/Arrow.js'

const gridSize = 128

const createTable = (size) => {
  const table = []
  for (let i = 0; i < size; i++) {
    const row = new Uint8Array(size)
    table.push(row)
  }
  return table
}

const table = createTable(gridSize)
const arrows = createTable(gridSize)
const diag = createTable()

const getScore = (rowChar, columnChar, column, wordLength) => {
  const baseScore = rowChar === columnChar ? 7 : -1
  if (column === wordLength && baseScore === 7) {
    return 5
  }
  return baseScore
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

function printTable(table, pattern, patternLen, word, wordLen) {
  function pad(s, n, pad = ' ') {
    while (s.length < n) {
      s = pad + s
    }
    return s
  }
  let ret = ` |   |${word
    .split('')
    .map((c) => pad(c, 3))
    .join('|')}\n`

  for (let i = 0; i <= patternLen; i++) {
    if (i === 0) {
      ret += ' |'
    } else {
      ret += `${pattern[i - 1]}|`
    }
    ret +=
      table[i]
        .slice(0, wordLen + 1)
        .map((n) => pad(n.toString(), 3))
        .join('|') + '\n'
  }
  return ret
}

const printTables = (pattern, patternStart, word, wordStart) => {
  pattern = pattern.substr(patternStart)
  word = word.substr(wordStart)
  console.log(PrintTable.printTable(table, pattern, pattern.length, word, word.length))
  console.log(PrintTable.printTable(arrows, pattern, pattern.length, word, word.length))
  // console.log(printTable(_diag, pattern, pattern.length, word, word.length));
}

const traceHighlights = (table, arrows, patternLength, wordLength) => {
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
    for (let column = 1; column < wordLength + 1; column++) {
      const columnChar = word[column - 1]
      const score = getScore(rowChar, columnChar, column, wordLength)
      let diagonalScore = score + table[row - 1][column - 1]
      if (arrows[row - 1][column - 1] === Arrow.Diagonal) {
        diagonalScore++
      }
      let leftScore = table[row][column - 1]
      if (leftScore > diagonalScore) {
        table[row][column] = leftScore
        arrows[row][column] = Arrow.Left
      } else {
        table[row][column] = diagonalScore
        arrows[row][column] = Arrow.Diagonal
      }
    }
  }
  // printTables(pattern, 0, word, 0)
  const highlights = traceHighlights(table, arrows, patternLength, wordLength)
  return highlights
}
