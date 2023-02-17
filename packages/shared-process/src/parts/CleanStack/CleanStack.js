import * as SplitLines from '../SplitLines/SplitLines.js'

const RE_AT = /^\s+at/
const RE_AT_PROMISE_INDEX = /^\s*at async Promise.all \(index \d+\)$/

const isInternalLine = (line) => {
  return line.includes('node:') || RE_AT_PROMISE_INDEX.test(line)
}

const isRelevantLine = (line) => {
  return !isInternalLine(line)
}

const isNormalStackLine = (line) => {
  return RE_AT.test(line) && !RE_AT_PROMISE_INDEX.test(line)
}

const getDetails = (lines) => {
  const index = lines.findIndex(isNormalStackLine)
  return {
    custom: lines.slice(0, index),
    actualStack: lines.slice(index),
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

export const cleanStack = (stack) => {
  const lines = SplitLines.splitLines(stack)
  const { custom, actualStack } = getDetails(lines)
  const relevantStack = actualStack.filter(isRelevantLine)
  const merged = mergeCustom(custom, relevantStack)
  return merged
}
