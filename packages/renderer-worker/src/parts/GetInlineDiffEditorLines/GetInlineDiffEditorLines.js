import * as DiffType from '../DiffType/DiffType.js'

export const getInlineDiffEditorLines = (linesLeft, linesRight, changesLeft, changesRight) => {
  const lengthLeft = linesLeft.length
  const lengthRight = linesRight.length
  const inlineDiffLinesLeft = []
  const inlineDiffLinesRight = []
  for (let i = 0; i < linesLeft.length; i++) {
    inlineDiffLinesLeft.push(DiffType.None)
  }
  for (let i = 0; i < linesRight.length; i++) {
    inlineDiffLinesRight.push(DiffType.None)
  }
  for (const change of changesLeft) {
    inlineDiffLinesLeft[change.index] = change.type
  }
  for (const change of changesRight) {
    inlineDiffLinesRight[change.index] = change.type
  }
  const merged = []
  let leftIndex = 0
  let rightIndex = 0
  while (leftIndex < lengthLeft && rightIndex < lengthRight) {
    const left = inlineDiffLinesLeft[leftIndex]
    const right = inlineDiffLinesRight[rightIndex]
    if (left === right) {
      merged.push({
        text: linesLeft[leftIndex],
        type: DiffType.None,
        index: leftIndex,
      })
      leftIndex++
      rightIndex++
    } else if (left === DiffType.Deletion) {
      merged.push({
        text: linesLeft[leftIndex],
        type: left,
        index: leftIndex,
      })
      leftIndex++
    } else if (leftIndex <= rightIndex) {
      merged.push({
        text: linesLeft[leftIndex],
        type: left,
        index: leftIndex,
      })
      leftIndex++
    } else if (leftIndex > rightIndex) {
      merged.push({
        text: linesRight[rightIndex],
        type: right,
        index: rightIndex,
      })
      rightIndex++
    } else {
      throw new Error('should not happen')
    }
  }
  while (leftIndex < lengthLeft) {
    const left = inlineDiffLinesLeft[leftIndex]
    merged.push({
      text: linesLeft[leftIndex],
      type: left,
      index: leftIndex,
    })
    leftIndex++
  }
  while (rightIndex < lengthRight) {
    const right = inlineDiffLinesRight[rightIndex]
    merged.push({
      text: linesRight[rightIndex],
      type: right,
      index: rightIndex,
    })
    rightIndex++
  }
  return merged
}
