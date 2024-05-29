import * as DiffType from '../DiffType/DiffType.js'

export const getInlineDiffEditorLines = (linesLeft, linesRight, changesLeft, changesRight) => {
  const inlineDiffLinesLeft = []
  const inlineDiffLinesRight = []
  for (const line of linesLeft) {
    inlineDiffLinesLeft.push({
      type: DiffType.None,
      text: line,
    })
  }
  for (const line of linesRight) {
    inlineDiffLinesRight.push({
      type: DiffType.None,
      text: line,
    })
  }
  for (const change of changesLeft) {
    inlineDiffLinesLeft[change.index].type = change.type
  }
  for (const change of changesRight) {
    inlineDiffLinesRight[change.index].type = change.type
  }
  const merged = []
  let leftIndex = 0
  let rightIndex = 0
  while (leftIndex < inlineDiffLinesLeft.length && rightIndex < inlineDiffLinesRight.length) {
    const left = inlineDiffLinesLeft[leftIndex]
    const right = inlineDiffLinesRight[rightIndex]
    if (left.type === right.type) {
      leftIndex++
      rightIndex++
      merged.push({
        text: left.text,
        type: DiffType.None,
      })
    } else if (left.type === DiffType.Deletion) {
      leftIndex++
      merged.push(left)
    } else if (leftIndex <= rightIndex) {
      leftIndex++
      merged.push(left)
    } else if (leftIndex > rightIndex) {
      rightIndex++
      merged.push(right)
    } else {
      throw new Error('should not happen')
    }
  }
  while (leftIndex < inlineDiffLinesLeft.length) {
    const left = inlineDiffLinesLeft[leftIndex++]
    merged.push(left)
  }
  while (rightIndex < inlineDiffLinesRight.length) {
    const right = inlineDiffLinesRight[rightIndex++]
    merged.push(right)
  }
  return merged
}
