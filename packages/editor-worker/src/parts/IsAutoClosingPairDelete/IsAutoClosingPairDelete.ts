import * as EditorSelection from '../EditorSelection/EditorSelection.ts'

export const isAutoClosingPairDelete = (
  autoClosingRanges: any,
  startRowIndex: number,
  startColumnIndex: number,
  endRowIndex: number,
  endColumnIndex: number,
) => {
  if (!EditorSelection.isEmpty(startRowIndex, startColumnIndex, endRowIndex, endColumnIndex)) {
    return false
  }
  if (startColumnIndex < 1) {
    return false
  }
  for (let j = 0; j < autoClosingRanges.length; j += 4) {
    const autoStartRowIndex = autoClosingRanges[j]
    const autoStartColumnIndex = autoClosingRanges[j + 1]
    // const autoEndRowIndex = autoClosingRanges[j + 2]
    // const autoEndColumnIndex = autoClosingRanges[j + 3]
    if (startRowIndex === autoStartRowIndex && startColumnIndex === autoStartColumnIndex) {
      return true
    }
  }
  return false
}
