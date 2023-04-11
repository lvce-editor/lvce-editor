import * as SplitLines from '../SplitLines/SplitLines.js'

const RE_NATIVE_MODULE_ERROR = /^innerError Error: Cannot find module '.*.node'/
const RE_NATIVE_MODULE_ERROR_2 = /was compiled against a different Node.js version/

const RE_MESSAGE_CODE_BLOCK_START = /^Error: The module '.*'$/
const RE_MESSAGE_CODE_BLOCK_END = /^\s* at/

const isUnhelpfulNativeModuleError = (stderr) => {
  return RE_NATIVE_MODULE_ERROR.test(stderr) && RE_NATIVE_MODULE_ERROR_2.test(stderr)
}

const isMessageCodeBlockStartIndex = (line) => {
  return RE_MESSAGE_CODE_BLOCK_START.test(line)
}

const isMessageCodeBlockEndIndex = (line) => {
  return RE_MESSAGE_CODE_BLOCK_END.test(line)
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
  return `incompatible native node module: ${message}`
}

const isModulesSyntaxError = (stderr) => {
  if (!stderr) {
    return false
  }
  return stderr.includes('SyntaxError: Cannot use import statement outside a module')
}

const getModuleSyntaxError = (stderr) => {
  return `ES Modules are not supported in electron`
}

export const getHelpfulChildProcessError = (stdout, stderr) => {
  if (isUnhelpfulNativeModuleError(stderr)) {
    return getNativeModuleErrorMessage(stderr)
  }
  if (isModulesSyntaxError(stderr)) {
    return getModuleSyntaxError(stderr)
  }
  return 'child process error'
}
