// parsing error handling based on https://github.com/sindresorhus/parse-json/blob/main/index.js

import { JsonParsingError } from '../JsonParsingError/JsonParsingError.js'
import * as Character from '../Character/Character.js'

export const parse = async (string, filePath) => {
  try {
    return JSON.parse(string)
  } catch (error) {
    const JsonError = await import('../JsonError/JsonError.js')
    const errorProps = JsonError.getErrorPropsFromError(error, string, filePath)
    throw new JsonParsingError(errorProps.message, errorProps.codeFrame, errorProps.stack)
  }
}

export const stringify = (value) => {
  return JSON.stringify(value, null, 2) + Character.NewLine
}
