import fallback from 'json-parse-even-better-errors'
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
    console.log(error)
    return {}
  }
}

export const parse = async (string, filePath) => {
  try {
    try {
      return JSON.parse(string)
    } catch (error) {
      fallback(string)
      throw error
    }
  } catch (error) {
    error.message = error.message.replace(/\n/g, '')
    const indexMatch = error.message.match(/in JSON at position (\d+)/)
    let topMessage = error.message
    let bottomMessage = error.message
    if (topMessage.startsWith('Unexpected token')) {
      topMessage = 'JSON parsing error:'
    }
    // console.log({ topMessage })
    if (bottomMessage.includes('while parsing "{')) {
      bottomMessage = bottomMessage.slice(
        0,
        bottomMessage.indexOf('while parsing "{')
      )
    }
    if (bottomMessage.includes(' (0x7D) ')) {
      bottomMessage = bottomMessage.replace(' (0x7D) ', ' ')
    }
    bottomMessage = bottomMessage.trim()
    const jsonError = new Error(topMessage)
    jsonError.message //?
    if (indexMatch && indexMatch.length > 0) {
      const lines = new LinesAndColumns(string)
      const index = Number(indexMatch[1])
      const location = lines.locationForIndex(index)
      const codeFrame = codeFrameColumns(
        string,
        { start: { line: location.line + 1, column: location.column + 1 } },
        { highlightCode: false }
      )
      jsonError.codeFrame = codeFrame
    }
    // console.log({ bottomMessage, message: error.message })
    jsonError.stack = `${bottomMessage}\n    at ${filePath}`
    throw jsonError
  }
}

export const stringify = (value) => {
  return JSON.stringify(value, null, 2) + '\n'
}
