const RE_ASCII = /^[\p{ASCII}]*$/u

export const isAscii = (line) => {
  return RE_ASCII.test(line)
}
