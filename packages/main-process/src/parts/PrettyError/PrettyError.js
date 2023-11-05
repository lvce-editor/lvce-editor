import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { codeFrameColumns } from '@babel/code-frame'
import { LinesAndColumns } from 'lines-and-columns'
import * as CleanStack from '../CleanStack/CleanStack.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as Json from '../Json/Json.js'

const RE_PATH_1 = /\((.*):(\d+):(\d+)\)$/
const RE_PATH_2 = /at (.*):(\d+):(\d+)$/
const RE_PATH_3 = /at (.*):(\d+)$/

const getActualPath = (fileUri) => {
  if (fileUri.startsWith('file://')) {
    return fileURLToPath(fileUri)
  }
  return fileUri
}

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

const prepareMessage = (message) => {
  if (message.startsWith('Cannot find module ') && message.includes('\n')) {
    return message.slice(0, GetNewLineIndex.getNewLineIndex(message))
  }
  return message
}

const getType = (error) => {
  if (!error) {
    return 'Error'
  }
  return error.name || error.constructor.name || 'Error'
}

export const prepare = (error) => {
  const message = prepareMessage(error.message)
  const lines = CleanStack.cleanStack(error.stack)
  const file = getFile(lines)
  let codeFrame = ''
  if (error.codeFrame) {
    codeFrame = error.codeFrame
  } else if (file) {
    let match = file.match(RE_PATH_1)
    if (!match) {
      match = file.match(RE_PATH_2)
    }
    if (!match) {
      match = file.match(RE_PATH_3)
    }
    if (match) {
      const [_, path, line, column] = match
      const actualPath = getActualPath(path)
      const rawLines = readFileSync(actualPath, EncodingType.Utf8) // TODO handle case when file cannot be found

      const location = {
        start: {
          line: Number.parseInt(line),
          column: Number.parseInt(column),
        },
      }
      codeFrame = codeFrameColumns(rawLines, location)
    }
  }
  let relevantStack = lines
  const index = lines.indexOf(file)
  if (index !== -1) {
    relevantStack = lines.slice(index)
  }
  for (const line of relevantStack) {
    let match = line.match(RE_PATH_1)
    if (!match) {
      match = line.match(RE_PATH_2)
    }
  }
  const type = getType(error)
  return {
    message,
    stack: JoinLines.joinLines(relevantStack),
    codeFrame,
    stderr: error.stderr,
    type,
  }
}

const fixBackslashes = (string) => {
  return string.replaceAll('\\\\', '\\')
}

export const prepareJsonError = (json, property, message) => {
  const string = fixBackslashes(Json.stringify(json))
  const stringifiedPropertyName = `"${property}"`
  const index = string.indexOf(stringifiedPropertyName) // TODO this could be wrong in some cases, find a better way
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

export const print = (prettyError) => {
  console.error(`Error: ${prettyError.message}\n\n${prettyError.codeFrame}\n\n${prettyError.stack}`)
}

export const firstErrorLine = (error) => {
  if (error.stack) {
    return error.stack.slice(0, GetNewLineIndex.getNewLineIndex(error.stack))
  }
  if (error.message) {
    return error.message
  }
  return `${error}`
}
