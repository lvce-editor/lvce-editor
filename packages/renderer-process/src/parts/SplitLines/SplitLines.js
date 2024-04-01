import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.ts'

export const splitLines = (lines) => {
  Assert.string(lines)
  return lines.split(Character.NewLine)
}
