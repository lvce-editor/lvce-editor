export const getNewLineIndex = (string: string, startIndex = undefined) => {
  return string.indexOf('\n', startIndex)
}
