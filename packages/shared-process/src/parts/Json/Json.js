import fallback from 'json-parse-even-better-errors'
import { codeFrameColumns } from '@babel/code-frame'
import { LinesAndColumns } from 'lines-and-columns'

// parsing error handling based on https://github.com/sindresorhus/parse-json/blob/main/index.js

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
    const indexMatch = error.message.match(
      /in JSON at position (\d+) while parsing/
    )
    let topMessage = error.message
    let bottomMessage = error.message
    if (topMessage.startsWith('Unexpected token')) {
      topMessage = 'JSON parsing error:'
    }
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
    if (indexMatch && indexMatch.length > 0) {
      const lines = new LinesAndColumns(string)
      const index = Number(indexMatch[1])
      const location = lines.locationForIndex(index)
      const codeFrame = codeFrameColumns(
        string,
        { start: { line: location.line + 1, column: location.column + 1 } },
        { highlightCode: true }
      )
      jsonError.codeFrame = codeFrame
    }
    // console.log({ bottomMessage, message: error.message })
    jsonError.stack = `${bottomMessage}\n    at ${filePath}`
    throw jsonError
  }

  // try {
  //   return JSON.parse(json)
  // } catch (error) {
  //   const parseJsonBetterErrors = await import('parse-json')
  //   try {
  //     return parseJsonBetterErrors.default(json, filePath)
  //   } catch (error) {
  //     console.log({ frame: error.codeFrame })
  //     throw error
  //   }
  // }
}

export const stringify = (value) => {
  return JSON.stringify(value, null, 2) + '\n'
}
