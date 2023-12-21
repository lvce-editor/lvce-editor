import * as DiffType from '../DiffType/DiffType.js'

export const getVisibleDiffLines = (lines, changes, minLineY, maxLineY) => {
  const visible = []
  const max = Math.min(lines.length, maxLineY)
  for (let i = minLineY; i < max; i++) {
    const line = lines[i]
    visible.push({
      line,
      type: DiffType.None,
    })
  }
  for (const change of changes) {
    visible[change.index].type = change.type
  }
  return visible
}
