const SplitLines = require('../SplitLines/SplitLines.js')

const isInternalLine = (line) => {
  return line.includes('node:')
}

const isRelevantLine = (line) => {
  return !isInternalLine(line)
}

const RE_AT = /^\s+at/

const isNormalStackLine = (line) => {
  return RE_AT.test(line)
}

const cleanLine = (line) => {
  if (line.startsWith('    at exports.')) {
    return '    at ' + line.slice('    at exports.'.length)
  }
  if (line.startsWith('    at async exports.')) {
    return '    at async ' + line.slice('    at async exports.'.length)
  }
  return line
}

const getDetails = (lines) => {
  const index = lines.findIndex(isNormalStackLine)
  return {
    custom: lines.slice(0, index),
    actualStack: lines.slice(index).map(cleanLine),
  }
}

const RE_PATH_1 = /^\/(.*)(\d+)$/

const mergeCustom = (custom, relevantStack) => {
  if (custom.length === 0) {
    return relevantStack
  }
  const firstLine = custom[0]
  if (RE_PATH_1.test(firstLine)) {
    return [`    at ${firstLine}`, ...relevantStack]
  }
  return relevantStack
}

const cleanStack = (stack) => {
  const lines = SplitLines.splitLines(stack)
  const { custom, actualStack } = getDetails(lines)
  const relevantStack = actualStack.filter(isRelevantLine)
  const merged = mergeCustom(custom, relevantStack)
  return merged
}

exports.cleanStack = cleanStack
