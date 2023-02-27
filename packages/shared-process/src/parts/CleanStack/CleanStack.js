import * as SplitLines from '../SplitLines/SplitLines.js'

const RE_AT = /^\s+at/
const RE_AT_PROMISE_INDEX = /^\s*at async Promise.all \(index \d+\)$/
const RE_OBJECT_AS = /^\s*at Object\.\w+ \[as ([\w\.]+)\]/

const isInternalLine = (line) => {
  return line.includes('node:') || RE_AT_PROMISE_INDEX.test(line)
}

const isRelevantLine = (line) => {
  return !isInternalLine(line)
}

const isNormalStackLine = (line) => {
  return RE_AT.test(line) && !RE_AT_PROMISE_INDEX.test(line)
}

const cleanLine = (line) => {
  if (line.startsWith('    at exports.')) {
    return '    at ' + line.slice('    at exports.'.length)
  }
  if (line.startsWith('    at async exports.')) {
    return '    at async ' + line.slice('    at async exports.'.length)
  }
  if (line.startsWith('    at async Module.')) {
    return '    at async ' + line.slice('    at async Module.'.length)
  }
  if (line.startsWith('    at Module.')) {
    return '    at ' + line.slice('    at Module.'.length)
  }
  const objectMatch = line.match(RE_OBJECT_AS)
  if (objectMatch) {
    return '    at ' + objectMatch[1] + line.slice(objectMatch[0].length)
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

export const cleanStack = (stack) => {
  const lines = SplitLines.splitLines(stack)
  const { custom, actualStack } = getDetails(lines)
  const relevantStack = actualStack.filter(isRelevantLine)
  const merged = mergeCustom(custom, relevantStack)
  return merged
}
