const RE_WHITESPACE = /^\s+$/

export const isWhitespace = (text) => {
  return RE_WHITESPACE.test(text)
}
