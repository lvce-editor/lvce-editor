import * as EscapeRegex from '../EscapeRegex/EscapeRegex.ts'

const regexFlags = 'gi'

export const getSearchRegex = (searchString: string) => {
  const escaped = EscapeRegex.escapeRegExpCharacters(searchString)
  return new RegExp(escaped, regexFlags)
}
