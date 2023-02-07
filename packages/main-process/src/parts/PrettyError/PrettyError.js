const { codeFrameColumns } = require('@babel/code-frame')
const { fileURLToPath } = require('node:url')
const { LinesAndColumns } = require('lines-and-columns')
const { readFileSync } = require('node:fs')
const CleanStack = require('../CleanStack/CleanStack.js')
const Json = require('../Json/Json.js')
const VError = require('verror')
const JoinLines = require('../JoinLines/JoinLines.js')

const RE_PATH_1 = /\((.*):(\d+):(\d+)\)$/
const RE_PATH_2 = /at (.*):(\d+):(\d+)$/

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
    if (RE_PATH_1.test(line) || RE_PATH_2.test(line)) {
      return line
    }
  }
  return ''
}

const prepareMessage = (message) => {
  if (message.startsWith('Cannot find module ') && message.includes('\n')) {
    return message.slice(0, message.indexOf('\n'))
  }
  return message
}

exports.prepare = (error) => {
  const message = prepareMessage(error.message)
  if (error instanceof VError) {
    error = error.cause()
  }
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
    if (match) {
      const [_, path, line, column] = match
      const actualPath = getActualPath(path)
      const rawLines = readFileSync(actualPath, 'utf-8') // TODO handle case when file cannot be found

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
  return {
    message,
    stack: JoinLines.joinLines(relevantStack),
    codeFrame,
    stderr: error.stderr,
  }
}

const fixBackslashes = (string) => {
  return string.replaceAll('\\\\', '\\')
}

exports.prepareJsonError = (json, property, message) => {
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

exports.print = (prettyError) => {
  console.error(`Error: ${prettyError.message}\n\n${prettyError.codeFrame}\n\n${prettyError.stack}`)
}

exports.firstErrorLine = (error) => {
  if (error.stack) {
    return error.stack.slice(0, error.stack.indexOf('\n'))
  }
  if (error.message) {
    return error.message
  }
  return `${error}`
}
