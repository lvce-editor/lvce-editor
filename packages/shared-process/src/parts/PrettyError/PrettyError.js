import { codeFrameColumns } from '@babel/code-frame'
import cleanStack from 'clean-stack'
import { LinesAndColumns } from 'lines-and-columns'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as Json from '../Json/Json.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

const getActualPath = (fileUri) => {
  if (fileUri.startsWith('file://')) {
    return fileURLToPath(fileUri)
  }
  return fileUri
}

const RE_MODULE_NOT_FOUND_STACK =
  /Cannot find package '([^']+)' imported from (.+)$/

const prepareModuleNotFoundError = (error) => {
  const message = error.message
  const match = message.match(RE_MODULE_NOT_FOUND_STACK)
  if (!match) {
    return {
      message,
      stack: error.stack,
      codeFrame: '',
    }
  }
  const notFoundModule = match[1]
  const importedFrom = match[2]
  const rawLines = readFileSync(importedFrom, 'utf-8')
  let line = 0
  let column = 0
  const splittedLines = rawLines.split('\n')
  for (let i = 0; i < splittedLines.length; i++) {
    const splittedLine = splittedLines[i]
    const index = splittedLine.indexOf(notFoundModule)
    if (index !== -1) {
      line = i + 1
      column = index
      break
    }
  }
  const location = {
    start: {
      line,
      column,
    },
  }
  const codeFrame = codeFrameColumns(rawLines, location)
  const stackLines = SplitLines.splitLines(error.stack)
  const newStackLines = [
    stackLines[0],
    `    at ${importedFrom}:${line}:${column}`,
    ...stackLines.slice(1),
  ]
  const newStack = newStackLines.join('\n')
  return {
    message,
    stack: newStack,
    codeFrame,
  }
}

export const prepare = (error) => {
  if (error && error.code === ErrorCodes.ERR_MODULE_NOT_FOUND) {
    return prepareModuleNotFoundError(error)
  }
  const message = error.message
  if (error && error.cause) {
    const cause = error.cause()
    if (cause) {
      error = cause
    }
  }
  const cleanedStack = cleanStack(error.stack)
  const lines = SplitLines.splitLines(cleanedStack)
  const file = lines[1]
  let codeFrame = ''
  if (error.codeFrame) {
    codeFrame = error.codeFrame
  } else if (file) {
    let match = file.match(/\((.*):(\d+):(\d+)\)$/)
    if (!match) {
      match = file.match(/at (.*):(\d+):(\d+)$/)
    }
    if (match) {
      const [_, path, line, column] = match
      const actualPath = getActualPath(path)
      const rawLines = readFileSync(actualPath, 'utf-8')
      const location = {
        start: {
          line: Number.parseInt(line),
          column: Number.parseInt(column),
        },
      }

      codeFrame = codeFrameColumns(rawLines, location)
    }
  }
  const relevantStack = lines.slice(1).join('\n')
  return {
    message,
    stack: relevantStack,
    codeFrame,
  }
}

const fixBackslashes = (string) => {
  return string.replaceAll('\\\\', '\\')
}

export const prepareJsonError = (json, property, message) => {
  const string = fixBackslashes(Json.stringify(json))
  const stringifiedPropertyName = `"${property}"`
  const index = string.indexOf(stringifiedPropertyName) // TODO this could be wrong in some cases, find a better way
  console.log({ string, index })
  const jsonError = {
    stack: '',
  }
  if (index !== -1) {
    const lines = new LinesAndColumns(string)
    const location = lines.locationForIndex(
      index + stringifiedPropertyName.length + 1
    )
    const codeFrame = codeFrameColumns(string, {
      start: { line: location.line + 1, column: location.column + 1 },
    })
    jsonError.codeFrame = codeFrame
  }
  // jsonError.stack = `${bottomMessage}\n    at ${filePath}`
  return jsonError
}

export const print = (prettyError, prefix = '') => {
  console.error(
    `${prefix}Error: ${prettyError.message}\n\n${prettyError.codeFrame}\n\n${prettyError.stack}`
  )
}
