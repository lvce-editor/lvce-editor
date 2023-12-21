export const getVisibleDiffLines = (lines, changes, minLineY, maxLineY) => {
  const visible = []
  for (let i = minLineY; i < maxLineY; i++) {
    const line = lines[i]
    const change = changes[i]
    visible.push({
      line,
      ...change,
    })
  }
  return visible
}
