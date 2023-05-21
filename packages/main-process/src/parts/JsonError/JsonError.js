const { codeFrameColumns } = require('@babel/code-frame')
const { LinesAndColumns } = require('lines-and-columns')

// parsing error handling based on https://github.com/sindresorhus/parse-json/blob/main/index.js

const emptyError = {
  message: '',
  stack: '',
  codeFrame: '',
}

const RE_POSITION = /in JSON at position (\d+)/

exports.getErrorPropsFromError = (error, string, filePath) => {
  const indexMatch = error.message.match(RE_POSITION)
  if (indexMatch && indexMatch.length > 0) {
    const lines = new LinesAndColumns(string)
    const index = Number(indexMatch[1])
    const location = lines.locationForIndex(index)
    if (location) {
      const line = location.line + 1
      const column = location.column + 1
      const codeFrame = codeFrameColumns(string, { start: { line, column } }, { highlightCode: false })
      return {
        codeFrame,
        message: `Json Parsing Error ${error.message}`,
        stack: `    at ${filePath}:${line}:${column}`,
      }
    }
  }
  if (string.length === 0) {
    return {
      codeFrame: ``,
      message: 'Json Parsing Error: Cannot parse empty string',
      stack: `    at ${filePath}`,
    }
  }

  if (error.message === 'Unexpected end of JSON input') {
    const lines = new LinesAndColumns(string)
    const index = string.length - 1
    const location = lines.locationForIndex(index)
    if (location) {
      const codeFrame = codeFrameColumns(string, { start: { line: location.line + 1, column: location.column + 1 } }, { highlightCode: false })
      return {
        codeFrame,
        message: 'Json Parsing Error',
        stack: `    at ${filePath}`,
      }
    }
  }
  return {
    codeFrame: ``,
    message: 'Json Parsing Error',
    stack: `    at ${filePath}`,
  }
}

exports.getErrorProps = (string, filePath) => {
  try {
    JSON.parse(string)
    return emptyError
  } catch (error) {
    return exports.getErrorPropsFromError(error, string, filePath)
  }
}
