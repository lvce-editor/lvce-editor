import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.js'
import * as IsAutoClosingPairDelete from '../IsAutoClosingPairDelete/IsAutoClosingPairDelete.js'

export const isAllAutoClosingPairDelete = (autoClosingRanges, selections) => {
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
    if (
      !IsAutoClosingPairDelete.isAutoClosingPairDelete(
        autoClosingRanges,
        selectionStartRow,
        selectionStartColumn,
        selectionEndRow,
        selectionEndColumn,
      )
    ) {
      return false
    }
  }
  return true
}
