const SplitLines = require('../SplitLines/SplitLines.js')

const isInternalLine = (line) => {
  return line.includes('node:')
}

const isRelevantLine = (line) => {
  return !isInternalLine(line)
}

const cleanStack = (stack) => {
  const lines = SplitLines.splitLines(stack)
  return lines.filter(isRelevantLine)
}

exports.cleanStack = cleanStack
