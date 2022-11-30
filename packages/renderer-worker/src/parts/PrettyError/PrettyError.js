import * as Command from '../Command/Command.js'
import * as CodeFrameColumns from '../CodeFrameColumns/CodeFrameColumns.js'

// TODO use https://github.com/stack-tools-js/stack-tools to print error

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
    const lines = error.stack.split('\n')
    const file = getFile(lines)
    let match = file.match(RE_PATH_1)
    if (!match) {
      match = file.match(RE_PATH_2)
    }
    // @ts-ignore
    const [_, path, line, column] = match
    const response = await fetch(path)
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const text = await response.text()

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
    console.log({ codeFrame })
    console.log({ path, line, column, text, codeFrame })
    return {
      message: error.message,
      codeFrame,
      stack: error.stack,
    }
  } catch (otherError) {
    console.warn(`ErrorHandling Error: ${otherError}`)
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
  console.log({ error })
  if (error && error.message && error.codeFrame) {
    return `${error.message}\n\n${error.codeFrame}\n\n${error.stack}`
  }
  if (error && error.stack) {
    return `${error.message}\n${error.stack}`
  }
  return `${error}`
}
