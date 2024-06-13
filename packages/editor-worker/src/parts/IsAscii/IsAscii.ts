const RE_ASCII = /^[\p{ASCII}]*$/u

export const isAscii = (line: string) => {
  return RE_ASCII.test(line)
}
