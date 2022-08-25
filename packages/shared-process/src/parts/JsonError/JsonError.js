import { codeFrameColumns } from '@babel/code-frame'
import { LinesAndColumns } from 'lines-and-columns'

// parsing error handling based on https://github.com/sindresorhus/parse-json/blob/main/index.js

const emptyError = {
  message: '',
  stack: '',
  codeFrame: '',
}

export const getError = (string, filePath) => {
  try {
    JSON.parse(string)
    return emptyError
  } catch (error) {
    const indexMatch = error.message.match(/in JSON at position (\d+)/)
    if (indexMatch && indexMatch.length > 0) {
      const lines = new LinesAndColumns(string)
      const index = Number(indexMatch[1])
      const location = lines.locationForIndex(index)
      if (location) {
        const codeFrame = codeFrameColumns(
          string,
          { start: { line: location.line + 1, column: location.column + 1 } },
          { highlightCode: false }
        )
        return {
          codeFrame,
          message: 'Json Parsing Error',
          stack: `at ${filePath}`,
        }
      }
    }
    if (string.length === 0) {
      return {
        codeFrame: ``,
        message: 'Json Parsing Error: Cannot parse empty string',
        stack: `at ${filePath}`,
      }
    }

    if (error.message === 'Unexpected end of JSON input') {
      const lines = new LinesAndColumns(string)
      const index = string.length - 1
      const location = lines.locationForIndex(index)
      if (location) {
        const codeFrame = codeFrameColumns(
          string,
          { start: { line: location.line + 1, column: location.column + 1 } },
          { highlightCode: false }
        )
        return {
          codeFrame,
          message: 'Json Parsing Error',
          stack: `at ${filePath}`,
        }
      }
    }
    return {
      codeFrame: ``,
      message: 'Json Parsing Error',
      stack: `at ${filePath}`,
    }
  }
}
