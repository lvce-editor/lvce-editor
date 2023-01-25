const RE_LINE_COLUMN = /(.*)(?:\(\d+\:\d+\))/

const getBabelErrorMessage = (message) => {
  const match = message.match(RE_LINE_COLUMN)
  if (match) {
    return match[1].trim()
  }
  return message
}

export class BabelParseError extends SyntaxError {
  constructor(url, error) {
    const message = getBabelErrorMessage(error.message)
    super(message)
    // @ts-ignore
    const line = error.loc.line
    // @ts-ignore
    const column = error.loc.column + 1
    this.stack = `${message}
  at ${url}:${line}:${column}`
  }
}
