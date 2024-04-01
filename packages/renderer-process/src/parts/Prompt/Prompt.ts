import * as Assert from '../Assert/Assert.ts'

export const prompt = (message, defaultValue) => {
  Assert.string(message)
  return window.prompt(message, defaultValue)
}
