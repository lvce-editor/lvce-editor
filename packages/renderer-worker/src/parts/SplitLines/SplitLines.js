import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.js'

export const splitLines = (lines) => {
  Assert.string(lines)
  return lines.split(Character.NewLine)
}
