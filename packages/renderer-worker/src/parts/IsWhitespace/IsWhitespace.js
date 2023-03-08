const RE_WHITESPACE = /^\s+$/

export const isWhitespace = (string) => {
  return RE_WHITESPACE.test(string)
}
