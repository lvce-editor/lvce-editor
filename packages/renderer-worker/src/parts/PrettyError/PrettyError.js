import * as Ajax from '../Ajax/Ajax.js'
import { AssertionError } from '../AssertionError/AssertionError.js'
import * as CleanStack from '../CleanStack/CleanStack.js'
import * as CodeFrameColumns from '../CodeFrameColumns/CodeFrameColumns.js'
import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as Logger from '../Logger/Logger.js'
import * as Platform from '../Platform/Platform.js'
import * as SourceMap from '../SourceMap/SourceMap.js'

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

const RE_SOURCE_MAP = /^\/\/# sourceMappingURL=(.*)$/

/**
 *
 * @param {readonly string[]} lines
 * @returns
 */
const getFile = (lines) => {
  for (const line of lines) {
    if (line.match(RE_PATH_1) || line.match(RE_PATH_2) || line.match(RE_PATH_3)) {
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

const getSourceMapMatch = (text) => {
  const index = text.lastIndexOf('\n', text.length - 2)
  const lastLine = text.slice(index + 1, -1)
  const lastLineMatch = lastLine.match(RE_SOURCE_MAP)
  if (lastLineMatch) {
    return lastLineMatch
  }
  const secondLastLineIndex = GetNewLineIndex.getNewLineIndex(text, index - 1)
  const secondLastLine = text.slice(secondLastLineIndex, index)
  const secondLastLineMatch = secondLastLine.match(RE_SOURCE_MAP)
  return secondLastLineMatch
}

const prepareErrorMessageWithoutCodeFrame = async (error) => {
  try {
    const lines = CleanStack.cleanStack(error.stack)
    const file = getFile(lines)
    let match = file.match(RE_PATH_1)
    if (!match) {
      match = file.match(RE_PATH_2)
    }
    if (!match) {
      match = file.match(RE_PATH_3)
    }
    if (!match) {
      return error
    }
    const [_, path, line, column] = match
    if (path === '<anonymous>' || path === 'debugger eval code' || path.startsWith('"') || path.startsWith(`'`) || path.startsWith(')')) {
      return error
    }
    const text = await Ajax.getText(path)
    const sourceMapMatch = getSourceMapMatch(text)
    const parsedLine = parseInt(line)
    const parsedColumn = parseInt(column)
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

export const print = (error) => {
  if (Platform.isFirefox) {
    // Firefox does not support printing codeframe with error stack
    console.log({ error })
    if (error && error._error) {
      Logger.error(error._error)
      return
    }
    Logger.error(error)
    return
  }
  if (error && error.type && error.message && error.codeFrame) {
    Logger.error(`${error.type}: ${error.message}\n\n${error.codeFrame}\n\n${error.stack}`)
    return
  }
  if (error && error.message && error.codeFrame) {
    Logger.error(`${error.message}\n\n${error.codeFrame}\n\n${error.stack}`)
    return
  }
  if (error && error.type && error.message) {
    Logger.error(`${error.type}: ${error.message}\n${error.stack}`)
    return
  }
  if (error && error.stack) {
    Logger.error(`${error.stack}`)
    return
  }
  if (error === null) {
    Logger.error(null)
    return
  }
  Logger.error(error)
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
