export const unquoteString = (string) => {
  if (string.startsWith("'") && string.endsWith("'")) {
    return string.slice(1, -1)
  }
  return string
}
