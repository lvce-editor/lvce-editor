const SplitLines = require('../SplitLines/SplitLines.js')

const RE_NATIVE_MODULE_ERROR = /^innerError Error: Cannot find module '.*.node'/
const RE_NATIVE_MODULE_ERROR_2 = /was compiled against a different Node.js version/

const RE_MASSAGE_CODE_BLOCK_START = /^Error: The module '.*'$/
const RE_MASSAGE_CODE_BLOCK_END = /^\s* at/
const RE_AT = /^    at /
const RE_JUST_PATH = /^(?:\/|\\).*\:\d+$/

const isUnhelpfulNativeModuleError = (stderr) => {
  return RE_NATIVE_MODULE_ERROR.test(stderr) && RE_NATIVE_MODULE_ERROR_2.test(stderr)
}

const isMessageCodeBlockStartIndex = (line) => {
  return RE_MASSAGE_CODE_BLOCK_START.test(line)
}

const isMessageCodeBlockEndIndex = (line) => {
  return RE_MASSAGE_CODE_BLOCK_END.test(line)
}

const getMessageCodeBlock = (stderr) => {
  const lines = SplitLines.splitLines(stderr)
  const startIndex = lines.findIndex(isMessageCodeBlockStartIndex)
  const endIndex = startIndex + lines.slice(startIndex).findIndex(isMessageCodeBlockEndIndex, startIndex)
  const relevantLines = lines.slice(startIndex, endIndex)
  const relevantMessage = relevantLines.join(' ').slice('Error: '.length)
  return relevantMessage
}

const getNativeModuleErrorMessage = (stderr) => {
  const message = getMessageCodeBlock(stderr)
  // TODO extract stack from stderr
  return new Error(`incompatible native node module: ${message}`)
}

const isModulesSyntaxError = (stderr) => {
  if (!stderr) {
    return false
  }
  return stderr.includes('SyntaxError: Cannot use import statement outside a module')
}

const isStackLine = (line) => {
  return RE_AT.test(line)
}

const isNotStackLine = (line) => {
  return !isStackLine(line)
}

const isJustPath = (line) => {
  return RE_JUST_PATH.test(line)
}

const getModulesErrorStack = (stderr) => {
  const lines = SplitLines.splitLines(stderr)
  let startIndex = -1
  const extraLines = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (isJustPath(line)) {
      extraLines.push(`    at ${line}`)
      break
    }
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (isStackLine(line)) {
      startIndex = i
      break
    }
  }
  if (startIndex === -1) {
    return ''
  }
  let endIndex = -1
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i]
    if (!isStackLine(line)) {
      endIndex = i
      break
    }
  }
  if (endIndex === -1) {
    endIndex = lines.length - 1
  }
  const stackLines = lines.slice(startIndex, endIndex)
  return [...extraLines, ...stackLines].join('\n')
}

const getModuleSyntaxError = (stderr) => {
  const message = `ES Modules are not supported in electron`
  const stack = getModulesErrorStack(stderr)
  const error = new SyntaxError(message)
  error.stack = message + '\n' + stack
  return error
}

exports.getHelpfulChildProcessError = (message, stdout, stderr) => {
  if (isUnhelpfulNativeModuleError(stderr)) {
    return getNativeModuleErrorMessage(stderr)
  }
  if (isModulesSyntaxError(stderr)) {
    return getModuleSyntaxError(stderr)
  }
  return new Error(message)
}
