import * as Ajax from '../Ajax/Ajax.js'
import * as CleanStack from '../CleanStack/CleanStack.js'
import * as CodeFrameColumns from '../CodeFrameColumns/CodeFrameColumns.js'
import * as GetSourceMapMatch from '../GetSourceMapMatch/GetSourceMapMatch.js'
import * as IsActualSourceFile from '../IsActualSourceFile/IsActualSourceFile.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as Logger from '../Logger/Logger.js'
// @ts-ignore
import * as Platform from '../Platform/Platform.js'
import * as SourceMap from '../SourceMap/SourceMap.js'
import * as IsFirefox from '../IsFirefox/IsFirefox.js'

const getErrorMessage = (error) => {
  if (!error) {
    return `Error: ${error}`
  }
  let message = error.message
  while (error.cause) {
    error = error.cause
    message += `: ${error}`
  }
  return message
}

const prepareErrorMessageWithCodeFrame = (error) => {
  if (!error) {
    return {
      message: error,
      stack: undefined,
      codeFrame: undefined,
      type: 'Error',
      _error: error,
    }
  }
  const message = getErrorMessage(error)
  const lines = CleanStack.cleanStack(error.stack)
  const relevantStack = JoinLines.joinLines(lines)
  if (error.codeFrame) {
    return {
      message,
      stack: relevantStack,
      codeFrame: error.codeFrame,
      type: error.constructor.name,
      _error: error,
    }
  }
  return {
    message,
    stack: error.originalStack,
    codeFrame: error.originalCodeFrame,
    category: error.category,
    stderr: error.stderr,
    _error: error,
  }
}

const RE_PATH_1 = /\((.*):(\d+):(\d+)\)$/
const RE_PATH_2 = /at (.*):(\d+):(\d+)$/
const RE_PATH_3 = /@(.*):(\d+):(\d+)$/ // Firefox

/**
 *
 * @param {readonly string[]} lines
 * @returns
 */
const getFile = (lines) => {
  for (const line of lines) {
    if (RE_PATH_1.test(line) || RE_PATH_2.test(line) || RE_PATH_3.test(line)) {
      return line
    }
  }
  return ''
}

const getSourceMapAbsolutePath = (file, relativePath) => {
  const folder = file.slice(0, file.lastIndexOf('/'))
  const absolutePath = folder + '/' + relativePath
  return absolutePath
}

const toAbsoluteUrl = (file, relativePath) => {
  const url = new URL(relativePath, file)
  return url.href
}

const prepareErrorMessageWithoutCodeFrame = async (error) => {
  try {
    const lines = CleanStack.cleanStack(error.stack)
    const file = getFile(lines)
    let match = file.match(RE_PATH_1)
    match ||= file.match(RE_PATH_2)
    match ||= file.match(RE_PATH_3)
    if (!match) {
      return error
    }
    const [_, path, line, column] = match
    if (!IsActualSourceFile.isActualSourceFile(path)) {
      return error
    }
    const text = await Ajax.getText(path)
    const sourceMapMatch = GetSourceMapMatch.getSourceMapMatch(text)
    const parsedLine = Number.parseInt(line)
    const parsedColumn = Number.parseInt(column)
    const message = getErrorMessage(error)
    const relevantStack = JoinLines.joinLines(lines)
    if (sourceMapMatch) {
      const sourceMapUrl = sourceMapMatch[1]
      const sourceMapAbsolutePath = getSourceMapAbsolutePath(path, sourceMapUrl)
      const sourceMap = await Ajax.getJson(sourceMapAbsolutePath)
      const { source, originalLine, originalColumn } = SourceMap.getOriginalPosition(sourceMap, parsedLine, parsedColumn)
      const absoluteSourceUrl = toAbsoluteUrl(path, source)
      const originalSourceContent = await Ajax.getText(absoluteSourceUrl)
      const codeFrame = CodeFrameColumns.create(originalSourceContent, {
        start: {
          line: originalLine,
          column: originalColumn,
        },
        end: {
          line: originalLine,
          column: originalColumn,
        },
      })
      return {
        message,
        codeFrame,
        stack: relevantStack,
        type: error.constructor.name,
        _error: error,
      }
    }
    const codeFrame = CodeFrameColumns.create(text, {
      start: {
        line: parsedLine,
        column: parsedColumn,
      },
      end: {
        line: parsedLine,
        column: parsedColumn,
      },
    })
    return {
      message,
      codeFrame,
      stack: relevantStack,
      type: error.constructor.name,
      _error: error,
    }
  } catch (otherError) {
    Logger.warn(`ErrorHandling Error: ${otherError}`)
    return error
  }
}

export const prepare = async (error) => {
  if (error && error.message && error.codeFrame) {
    return prepareErrorMessageWithCodeFrame(error)
  }
  if (error && error.stack) {
    return prepareErrorMessageWithoutCodeFrame(error)
  }
  return error
}

export const print = async (error, prefix = '') => {
  if (IsFirefox.isFirefox) {
    // Firefox does not support printing codeframe with error stack
    if (error && error._error) {
      Logger.error(`${prefix}${error._error}`)
      return
    }
    Logger.error(`${prefix}${error}`)
    return
  }
  if (error && error.type && error.message && error.codeFrame) {
    Logger.error(`${prefix}${error.type}: ${error.message}\n\n${error.codeFrame}\n\n${error.stack}`)
    return
  }
  if (error && error.message && error.codeFrame) {
    Logger.error(`${prefix}${error.message}\n\n${error.codeFrame}\n\n${error.stack}`)
    return
  }
  if (error && error.type && error.message) {
    Logger.error(`${prefix}${error.type}: ${error.message}\n${error.stack}`)
    return
  }
  if (error && error.stack) {
    Logger.error(`${prefix}${error.stack}`)
    return
  }
  if (error === null) {
    Logger.error(`${prefix}null`)
    return
  }
  Logger.error(`${prefix}${error}`)
}

export const getMessage = (error) => {
  if (error && error.type && error.message) {
    return `${error.type}: ${error.message}`
  }
  if (error && error.message) {
    return `${error.constructor.name}: ${error.message}`
  }
  return `Error: ${error}`
}
