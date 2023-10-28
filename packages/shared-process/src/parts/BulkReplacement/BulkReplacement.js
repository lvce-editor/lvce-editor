import * as ApplyEdit from '../ApplyEdit/ApplyEdit.js'
import { VError } from '../VError/VError.js'

export const applyBulkReplacement = async (files, ranges, replacement) => {
  try {
    let rangeIndex = 0
    for (const file of files) {
      const rangeLength = ranges[rangeIndex]
      const rangeStartIndex = rangeIndex + 1
      const rangeEndIndex = rangeStartIndex + rangeLength
      const fileRanges = ranges.slice(rangeStartIndex, rangeEndIndex)
      await ApplyEdit.applyEdit(file, fileRanges, replacement)
      rangeIndex = rangeEndIndex
    }
  } catch (error) {
    throw new VError(error, `Bulk replacement failed`)
  }
}
