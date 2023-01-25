const RE_ASCII = /^[a-z\d\s]+$/i

export const isAscii = (line) => {
  return RE_ASCII.test(line)
}
