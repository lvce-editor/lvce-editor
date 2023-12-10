import * as EscapeRegex from '../EscapeRegex/EscapeRegex.js'

const regexFlags = 'gi'

export const getSearchRegex = (searchString) => {
  const escaped = EscapeRegex.escapeRegExpCharacters(searchString)
  return new RegExp(escaped, regexFlags)
}
