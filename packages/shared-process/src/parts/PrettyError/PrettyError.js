import { codeFrameColumns } from '@babel/code-frame'
import { LinesAndColumns } from 'lines-and-columns'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as CleanStack from '../CleanStack/CleanStack.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as Json from '../Json/Json.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

const getActualPath = (fileUri) => {
  if (fileUri.startsWith('file://')) {
    return fileURLToPath(fileUri)
  }
  return fileUri
}

const RE_MODULE_NOT_FOUND_STACK = /Cannot find package '([^']+)' imported from (.+)$/

const prepareModuleNotFoundError = (error) => {
  const { message } = error
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
  const rawLines = readFileSync(importedFrom, EncodingType.Utf8)
  let line = 0
  let column = 0
  const splittedLines = SplitLines.splitLines(rawLines)
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
  const newStackLines = [stackLines[0], `    at ${importedFrom}:${line}:${column}`, ...stackLines.slice(1)]
  const newStack = JoinLines.joinLines(newStackLines)
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
  const { message } = error
  if (error && error.cause) {
    const cause = error.cause()
    if (cause) {
      error = cause
    }
  }
  const lines = CleanStack.cleanStack(error.stack)
  const file = lines[0]
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
      const rawLines = readFileSync(actualPath, EncodingType.Utf8)
      const location = {
        start: {
          line: Number.parseInt(line),
          column: Number.parseInt(column),
        },
      }
      codeFrame = codeFrameColumns(rawLines, location)
    }
  }
  const relevantStack = JoinLines.joinLines(lines)
  return {
    message,
    stack: relevantStack,
    codeFrame,
    type: error.constructor.name,
    code: error.code,
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
    const location = lines.locationForIndex(index + stringifiedPropertyName.length + 1)
    const codeFrame = codeFrameColumns(string, {
      // @ts-ignore
      start: { line: location.line + 1, column: location.column + 1 },
    })
    jsonError.codeFrame = codeFrame
  }
  // jsonError.stack = `${bottomMessage}\n    at ${filePath}`
  return jsonError
}
