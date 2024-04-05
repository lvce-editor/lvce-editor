import * as SplitLines from '../SplitLines/SplitLines.js'

export const getElsProblemMessage = (message) => {
  const lines = SplitLines.splitLines(message)
  for (const line of lines) {
    if (line.includes('npm ERR! invalid:') || line.includes('npm ERR! missing:')) {
      return line
    }
  }
  return message
}
