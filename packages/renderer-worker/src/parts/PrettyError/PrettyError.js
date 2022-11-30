import * as Ajax from '../Ajax/Ajax.js'
import * as CodeFrameColumns from '../CodeFrameColumns/CodeFrameColumns.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

const prepareErrorMessageWithCodeFrame = (error) => {
  if (!error) {
    return {
      message: `Error: ${error}`,
      stack: undefined,
      codeFrame: undefined,
    }
  }
  let message = `${error}`
  while (error.cause) {
    error = error.cause
    message += `: ${error}`
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
    if (line.match(RE_PATH_1) || line.match(RE_PATH_2)) {
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
    // @ts-ignore
    const [_, path, line, column] = match
    const text = await Ajax.getText(path)
    const parsedLine = parseInt(line)
    const parsedColumn = parseInt(column)
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
    return {
      message: error.message,
      codeFrame,
      stack: relevantStack,
      type: error.constructor.name,
    }
  } catch (otherError) {
    console.warn(`ErrorHandling Error`)
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
  if (error && error.stack) {
    return `${error.message}\n${error.stack}`
  }
  return `${error}`
}
