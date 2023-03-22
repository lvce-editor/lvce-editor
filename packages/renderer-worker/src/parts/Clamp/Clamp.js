import * as Assert from '../Assert/Assert.js'

export const clamp = (num, min, max) => {
  Assert.number(num)
  Assert.number(min)
  Assert.number(max)
  return Math.min(Math.max(num, min), max)
}
