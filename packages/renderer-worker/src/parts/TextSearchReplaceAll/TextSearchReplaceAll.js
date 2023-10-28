import * as Command from '../Command/Command.js'
import * as GetBulkReplacementEdits from '../GetBulkReplacementEdits/GetBulkReplacementEdits.js'

export const replaceAll = async (workspacePath, items, replacement) => {
  const { files, ranges } = GetBulkReplacementEdits.getBulkReplacementEdits(workspacePath, items)
  await Command.execute('BulkReplacement.applyBulkReplacement', files, ranges, replacement)
}
