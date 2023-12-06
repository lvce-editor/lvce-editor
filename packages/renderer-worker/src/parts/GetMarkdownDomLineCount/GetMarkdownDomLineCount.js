export const getMarkdownDomLineCount = (dom) => {
  let depth = 0
  let lineCount = 0
  for (const element of dom) {
    depth += element.childCount - 1
    if (depth === 0) {
      lineCount++
    }
  }
  lineCount--
  return lineCount
}
