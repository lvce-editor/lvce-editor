import * as ApplyEdit from '../ApplyEdit/ApplyEdit.js'

export const applyBulkReplacement = async (files, ranges, replacement) => {
  let rangeIndex = 0
  for (const file of files) {
    const rangeLength = ranges[rangeIndex]
    const rangeStartIndex = rangeIndex + 1
    const rangeEndIndex = rangeStartIndex + rangeLength
    const fileRanges = ranges.slice(rangeStartIndex, rangeEndIndex)
    await ApplyEdit.applyEdit(file, fileRanges, replacement)
    rangeIndex = rangeEndIndex
  }
}
