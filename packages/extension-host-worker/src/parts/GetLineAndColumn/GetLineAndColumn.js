export const getLineAndColumn = (text, start, end) => {
  let index = -1
  let line = 0
  let column = 0
  while ((index = text.indexOf('\n', index + 1)) !== -1) {
    line++
    if (index >= start) {
      break
    }
  }
  return {
    line,
    column,
  }
}
