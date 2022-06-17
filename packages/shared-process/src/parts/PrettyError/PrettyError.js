import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { codeFrameColumns } from '@babel/code-frame'
import cleanStack from 'clean-stack'
import { LinesAndColumns } from 'lines-and-columns'

const getActualPath = (fileUri) => {
  if (fileUri.startsWith('file://')) {
    return fileURLToPath(fileUri)
  }
  return fileUri
}

export const prepare = (error) => {
  const message = error.message
  if (error.cause) {
    error = error.cause()
  }
  const cleanedStack = cleanStack(error.stack)
  const lines = cleanedStack.split('\n')
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

const stringifyJson = (json) => {
  return JSON.stringify(json, null, 2) + '\n'
}

export const prepareJsonError = (json, property, message) => {
  const string = fixBackslashes(stringifyJson(json))
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

export const print = (prettyError) => {
  console.error(
    `Error: ${prettyError.message}\n\n${prettyError.codeFrame}\n\n${prettyError.stack}`
  )
}
