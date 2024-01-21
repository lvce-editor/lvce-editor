import { VError } from '../VError/VError.js'
import * as Character from '../Character/Character.js'

export const stringify = (value) => {
  return JSON.stringify(value, null, 2) + Character.NewLine
}

export const stringifyCompact = (value) => {
  return JSON.stringify(value)
}

export const parse = (content) => {
  if (content === 'undefined') {
    return null
  }
  // TODO use better json parse to throw more helpful error messages if json is invalid
  try {
    return JSON.parse(content)
  } catch (error) {
    throw new VError(error, 'failed to parse json')
  }
}
