import * as Character from '../Character/Character.js'

const firstLetterLowerCase = (string) => {
  return string[0].toLowerCase() + string.slice(1)
}

export const camelCase = (string) => {
  const parts = string.split(Character.Space)
  const lowerParts = parts.map(firstLetterLowerCase)
  return lowerParts.join(Character.Dash)
}
