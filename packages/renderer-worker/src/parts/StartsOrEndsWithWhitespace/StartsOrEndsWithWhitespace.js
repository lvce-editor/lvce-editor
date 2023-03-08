const RE_WHITESPACE = /^\s|\s$/

export const startsOrEndsWithWhitespace = (string) => {
  return RE_WHITESPACE.test(string)
}
