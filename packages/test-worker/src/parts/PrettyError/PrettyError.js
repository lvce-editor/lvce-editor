import * as Ajax from '../Ajax/Ajax.js'
import * as CodeFrameColumns from '../CodeFrameColumns/CodeFrameColumns.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

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
    }
  }
  const message = getErrorMessage(error)
  if (error.codeFrame) {
    return {
      message,
      stack: error.stack,
      codeFrame: error.codeFrame,
      type: error.constructor.name,
    }
  }
  return {
    message,
    stack: error.originalStack,
    codeFrame: error.originalCodeFrame,
    category: error.category,
    stderr: error.stderr,
  }
}

const RE_PATH_1 = /\((.*):(\d+):(\d+)\)$/
const RE_PATH_2 = /at (.*):(\d+):(\d+)$/

/**
 *
 * @param {readonly string[]} lines
 * @returns
 */
const getFile = (lines) => {
  for (const line of lines) {
    if (RE_PATH_1.test(line) || RE_PATH_2.test(line)) {
      return line
    }
  }
  return ''
}

const prepareErrorMessageWithoutCodeFrame = async (error) => {
  try {
    const lines = SplitLines.splitLines(error.stack)
    const file = getFile(lines)
    let match = file.match(RE_PATH_1)
    if (!match) {
      match = file.match(RE_PATH_2)
    }
    if (!match) {
      return error
    }
    const [_, path, line, column] = match
    const text = await Ajax.getText(path)
    const parsedLine = Number.parseInt(line)
    const parsedColumn = Number.parseInt(column)
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
    const relevantStack = JoinLines.joinLines(lines.slice(1))
    const message = getErrorMessage(error)
    return {
      message,
      codeFrame,
      stack: relevantStack,
      type: error.constructor.name,
    }
  } catch (otherError) {
    console.warn('ErrorHandling Error')
    console.warn(otherError)
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
  if (error && error.type && error.message && error.codeFrame) {
    return `${error.type}: ${error.message}\n\n${error.codeFrame}\n\n${error.stack}`
  }
  if (error && error.message && error.codeFrame) {
    return `${error.message}\n\n${error.codeFrame}\n\n${error.stack}`
  }
  if (error && error.type && error.message) {
    return `${error.type}: ${error.message}\n${error.stack}`
  }
  if (error && error.stack) {
    return `${error.stack}`
  }
  if (error === null) {
    return null
  }
  return `${error}`
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
