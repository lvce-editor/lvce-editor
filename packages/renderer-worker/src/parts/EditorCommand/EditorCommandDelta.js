// import * as TextSegmenter from '../TextSegmenter/TextSegmenter.js'

export const characterLeft = (line, columnIndex) => {
  // if (!TextSegmenter.supported()) {
  return 1
  // }
  // const segmenter = TextSegmenter.create()
  // const last = segmenter.at(line, columnIndex - 1)
  // return columnIndex - last.index
}

export const characterRight = (line, columnIndex) => {
  // if (!TextSegmenter.supported()) {
  return 1
  // }
  // const segmenter = TextSegmenter.create()
  // const next = segmenter.at(line, columnIndex)
  // return next.segment.length
}

const isWhitespace = (char) => {
  return char === ' ' || char === '\t'
}

export const lineCharacterStart = (line, columnIndex) => {
  if (line.length === 0) {
    return 0
  }
  for (let i = 0; i < columnIndex; i++) {
    if (!isWhitespace(line[i])) {
      return columnIndex - i
    }
  }
  return columnIndex
}

export const lineEnd = (line, columnIndex) => {
  return line.length - columnIndex
}

const tryRegexArray = (partialLine, regexArray) => {
  for (const regex of regexArray) {
    const match = partialLine.match(regex)
    if (match) {
      return match[0].length
    }
  }
  return 1
}

const RE_WORD_LEFT_1 = /(?<![A-Z])[A-Z]+\s*$/
const RE_WORD_LEFT_2 = /[\u00C0-\u017F\w\-]+>?\s*$/
const RE_WORD_LEFT_3 = /[a-zA-Z]+[^a-zA-Z\d]+\s*$/
const RE_WORD_LEFT_4 = /\s+$/
const RE_WORD_LEFT_5 = /[^a-zA-Z\d]+\s*$/
const RE_WORD_LEFT = [
  RE_WORD_LEFT_1,
  RE_WORD_LEFT_2,
  RE_WORD_LEFT_3,
  RE_WORD_LEFT_4,
  RE_WORD_LEFT_5,
]

export const wordLeft = (line, columnIndex) => {
  const partialLine = line.slice(0, columnIndex)
  return tryRegexArray(partialLine, RE_WORD_LEFT)
}

const RE_WORD_RIGHT_1 = /^\s*[\u00C0-\u017F\w]+/i
const RE_WORD_RIGHT_2 = /^[^a-zA-Z\d]+\w*/
const RE_WORD_RIGHT = [RE_WORD_RIGHT_1, RE_WORD_RIGHT_2]

export const wordRight = (line, columnIndex) => {
  const partialLine = line.slice(columnIndex)
  return tryRegexArray(partialLine, RE_WORD_RIGHT)
}

const RE_PARTIAL_WORD_LEFT_1 = /(?<![A-Z])[A-Z]{2}[a-z]+$/
const RE_PARTIAL_WORD_LEFT_2 = /(?=[A-Z]+)[A-Z][a-z]+$/
const RE_PARTIAL_WORD_LEFT_3 = /[A-Z]+[a-z]+\d?\s*$/
const RE_PARTIAL_WORD_LEFT_4 = /[A-Z]+\d*\s*$/
const RE_PARTIAL_WORD_LEFT_5 = /[a-z]+\d*\s*$/
const RE_PARTIAL_WORD_LEFT_6 = /[A-Z]*[a-z]+_+\s*$/
const RE_PARTIAL_WORD_LEFT_7 = /(?<![A-Z])[A-Z]_+\s*$/
const RE_PARTIAL_WORD_LEFT_8 = /[a-z]+\s*$/
const RE_PARTIAL_WORD_LEFT_9 = /[^a-zA-Z\d\s]+\s*$/
const RE_PARTIAL_WORD_LEFT = [
  RE_PARTIAL_WORD_LEFT_1,
  RE_PARTIAL_WORD_LEFT_2,
  RE_PARTIAL_WORD_LEFT_3,
  RE_PARTIAL_WORD_LEFT_4,
  RE_PARTIAL_WORD_LEFT_5,
  RE_PARTIAL_WORD_LEFT_6,
  RE_PARTIAL_WORD_LEFT_7,
  RE_PARTIAL_WORD_LEFT_8,
  RE_PARTIAL_WORD_LEFT_9,
]

export const wordPartLeft = (line, columnIndex) => {
  const partialLine = line.slice(0, columnIndex)
  return tryRegexArray(partialLine, RE_PARTIAL_WORD_LEFT)
}

const RE_PARTIAL_WORD_RIGHT_1 = /^\s*[a-z]+\d?/
const RE_PARTIAL_WORD_RIGHT_2 = /^\s*[A-Z]{2}[a-z\d]+/
const RE_PARTIAL_WORD_RIGHT_3 = /^\s*[A-Z]+(?=[A-Z][a-z]+)/
const RE_PARTIAL_WORD_RIGHT_4 = /^\s*[A-Z]+[a-z]*\d*/
const RE_PARTIAL_WORD_RIGHT_5 = /^\s*_+[a-z]*\d?/
const RE_PARTIAL_WORD_RIGHT_6 = /^\s*[^\da-zA-Z\s]+/
// const RE_PARTIAL_WORD_RIGHT_6 = /^\s*[A-Z][A-Z](?![A-Z])*/
// const RE_PARTIAL_WORD_RIGHT_7 = /^\s*[A-Z][A-Z][a-z]*/

const ARRAY_PARTIAL_WORD_RIGHT_1 = [
  RE_PARTIAL_WORD_RIGHT_1,
  // RE_PARTIAL_WORD_RIGHT_2,
  RE_PARTIAL_WORD_RIGHT_3,
  RE_PARTIAL_WORD_RIGHT_4,
  RE_PARTIAL_WORD_RIGHT_5,
  RE_PARTIAL_WORD_RIGHT_6,
]
const ARRAY_PARTIAL_WORD_RIGHT_2 = [
  RE_PARTIAL_WORD_RIGHT_1,
  RE_PARTIAL_WORD_RIGHT_2,
  RE_PARTIAL_WORD_RIGHT_3,
  RE_PARTIAL_WORD_RIGHT_4,
  RE_PARTIAL_WORD_RIGHT_5,
  RE_PARTIAL_WORD_RIGHT_6,
]

const RE_UPPERCASE = /[A-Z]/

export const wordPartRight = (line, columnIndex) => {
  const partialLine = line.slice(columnIndex)
  // line[columnIndex]//?
  if (RE_UPPERCASE.test(line[columnIndex - 1])) {
    return tryRegexArray(partialLine, ARRAY_PARTIAL_WORD_RIGHT_1)
  }
  return tryRegexArray(partialLine, ARRAY_PARTIAL_WORD_RIGHT_2)
}

// wordPartRight('"command": "actions.find"', 8) //?
// 'DDa'.match(RE_PARTIAL_WORD_RIGHT_1) //?
// wordPartRight('DDa', 0) //?
// wordPartRight('DEBUGEntry', 3) //?

export const line = (line) => {}
