import * as Command from '../Command/Command.js'
import * as GetBulkReplacementEdits from '../GetBulkReplacementEdits/GetBulkReplacementEdits.js'

export const replaceAll = async (items, replacement) => {
  const shouldReplace = await Command.execute('ConfirmPrompt.prompt', 'Replace all?', 'Replace All')
  if (!shouldReplace) {
    return
  }
  const { files, ranges } = GetBulkReplacementEdits.getBulkReplacementEdits(items)
  await Command.execute('BulkReplacement.applyBulkReplacement', files, ranges, replacement)
}
