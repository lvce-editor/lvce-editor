import * as IsAutoClosingPairDelete from '../IsAutoClosingPairDelete/IsAutoClosingPairDelete.js'

export const isAllAutoClosingPairDelete = (autoClosingRanges, selections) => {
  for (let i = 0; i < selections.length; i += 4) {
    const startRowIndex = selections[i]
    const startColumnIndex = selections[i + 1]
    const endRowIndex = selections[i + 2]
    const endColumnIndex = selections[i + 3]
    if (!IsAutoClosingPairDelete.isAutoClosingPairDelete(autoClosingRanges, startRowIndex, startColumnIndex, endRowIndex, endColumnIndex)) {
      return false
    }
  }
  return true
}
