import * as Assert from '../Assert/Assert.js'

export const splitLines = (lines) => {
  Assert.array(lines)
  return lines.split('\n')
}
