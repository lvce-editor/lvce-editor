import * as DiffType from '../DiffType/DiffType.js'

export const getInlineDiffEditorLines = (linesLeft, linesRight, inlineChanges) => {
  const merged = []
  for (const inlineChange of inlineChanges) {
    const { type, leftIndex, rightIndex } = inlineChange
    switch (inlineChange.type) {
      case DiffType.None:
        merged.push({
          type,
          leftIndex,
          rightIndex,
          text: linesLeft[leftIndex],
        })
        break
      case DiffType.Deletion:
        merged.push({
          type,
          leftIndex,
          rightIndex,
          text: linesLeft[leftIndex],
        })
        break
      case DiffType.Insertion:
        merged.push({
          type,
          leftIndex,
          rightIndex,
          text: linesRight[rightIndex],
        })
        break
      default:
        break
    }
  }
  return merged
}
