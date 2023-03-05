import * as Assert from '../Assert/Assert.js'

export const splitLines = (lines) => {
  Assert.string(lines)
  return lines.split('\n')
}
