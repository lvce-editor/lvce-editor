import * as SplitLines from '../SplitLines/SplitLines.js'

const RE_AT = /^ {4}at /
const RE_JUST_PATH = /^(?:file:\/\/|\/|\\).*:\d+$/
const RE_JUST_MESSAGE = /^\w+/

const isStackLine = (line) => {
  return RE_AT.test(line)
}

const isJustPath = (line) => {
  return RE_JUST_PATH.test(line)
}

const isPartOfMessage = (line) => {
  return RE_JUST_MESSAGE.test(line)
}

export const getModulesErrorStack = (stderr) => {
  const lines = SplitLines.splitLines(stderr)
  let startIndex = -1
  const extraLines = []
  for (const line of lines) {
    if (isJustPath(line)) {
      extraLines.push(`    at ${line}`)
      break
    }
  }
  for (const [i, line] of lines.entries()) {
    if (isStackLine(line)) {
      startIndex = i
      break
    }
  }
  let messageStartIndex = startIndex - 1
  for (let i = messageStartIndex; i >= 0; i--) {
    const line = lines[i]
    if (!isPartOfMessage(line)) {
      break
    }
    messageStartIndex = i
  }
  if (startIndex === -1) {
    return []
  }
  let endIndex = -1
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i]
    if (!isStackLine(line)) {
      endIndex = i
      break
    }
  }
  if (endIndex === -1) {
    endIndex = lines.length - 1
  }
  const stackLines = lines.slice(startIndex, endIndex)
  let message = lines.slice(messageStartIndex, startIndex).join(' ')
  if (message === '') {
    for (let i = 0; i < startIndex; i++) {
      const line = lines[i]
      if (line.startsWith('SyntaxError: Named export')) {
        messageStartIndex = i
        break
      }
    }
    message = lines.slice(messageStartIndex, startIndex).join(' ').trim()
  }
  return [message, ...extraLines, ...stackLines]
}
