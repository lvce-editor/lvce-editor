export const getVisibleInlineDiffEditorLines = (inlineDiffLines, minLineY, maxLineY) => {
  return inlineDiffLines.slice(minLineY, maxLineY)
}
