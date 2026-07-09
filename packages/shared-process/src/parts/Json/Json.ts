// parsing error handling based on https://github.com/sindresorhus/parse-json/blob/main/index.js

import { VError } from '../VError/VError.ts'
import * as Character from '../Character/Character.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export const parse = async (string, filePath) => {
  try {
    return JSON.parse(string)
  } catch (error) {
    const betterError = new VError(error, `Failed to parse json at ${filePath}`)
    // @ts-ignore
    betterError.code = ErrorCodes.E_JSON_PARSE
    throw betterError
  }
}

export const stringify = (value) => {
  return JSON.stringify(value, null, 2) + Character.NewLine
}
