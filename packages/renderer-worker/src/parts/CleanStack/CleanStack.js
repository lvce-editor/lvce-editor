import * as SplitLines from '../SplitLines/SplitLines.js'
import * as Assert from '../Assert/Assert.js'

const RE_AT = /^\s+at/
const RE_AT_PROMISE_INDEX = /^\s*at async Promise.all \(index \d+\)$/
const RE_OBJECT_AS = /^\s*at Object\.\w+ \[as ([\w\.]+)\]/
const RE_PATH_1 = /\((.*):(\d+):(\d+)\)$/
const RE_PATH_2 = /at (.*):(\d+):(\d+)$/
const RE_PATH_3 = /@(.*):(\d+):(\d+)$/ // Firefox
const RE_RESTORE_JSON_RPC_ERROR = /^\s*at restoreJsonRpcError/
const RE_JSON_RPC_INVOKE = /^\s*at invoke .*JsonRpc\.js/
const RE_ASSERT = /^\s*at .*\/Assert\.js/
const RE_CONSTRUCT_ERROR = /^\s*at constructError /

const isInternalLine = (line) => {
  return RE_AT_PROMISE_INDEX.test(line)
}

const isRelevantLine = (line) => {
  return !isInternalLine(line)
}

const isNormalStackLine = (line) => {
  return (RE_AT.test(line) && !RE_AT_PROMISE_INDEX.test(line)) || RE_PATH_2.test(line) || RE_PATH_3.test(line)
}

const isApplicationUsefulLine = (line, index) => {
  if (index === 0) {
    if (RE_ASSERT.test(line)) {
      return false
    }
    return true
  }
  if (RE_RESTORE_JSON_RPC_ERROR.test(line)) {
    return false
  }
  if (RE_JSON_RPC_INVOKE.test(line)) {
    return false
  }
  if (RE_CONSTRUCT_ERROR.test(line)) {
    return false
  }
  return true
}

const cleanLine = (line) => {
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

const mergeCustom = (custom, relevantStack) => {
  if (custom.length === 0) {
    return relevantStack
  }
  const firstLine = custom[0]
  if (RE_PATH_1.test(firstLine)) {
    return [`    at ${firstLine}`, ...relevantStack]
  }
  if (RE_PATH_2.test(firstLine)) {
    return [`    at ${firstLine}`, ...relevantStack]
  }
  if (RE_PATH_3.test(firstLine)) {
    return [firstLine, ...relevantStack]
  }
  return relevantStack
}

export const cleanStack = (stack) => {
  Assert.string(stack)
  const lines = SplitLines.splitLines(stack)
  const { custom, actualStack } = getDetails(lines)
  const relevantStack = actualStack.filter(isRelevantLine).filter(isApplicationUsefulLine)
  const merged = mergeCustom(custom, relevantStack)
  return merged
}
