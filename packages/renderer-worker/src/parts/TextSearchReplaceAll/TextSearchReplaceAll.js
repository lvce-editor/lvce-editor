import * as Command from '../Command/Command.js'
import * as GetBulkReplacementEdits from '../GetBulkReplacementEdits/GetBulkReplacementEdits.js'
import { VError } from '../VError/VError.js'

export const replaceAll = async (items, replacement) => {
  try {
    const shouldReplace = await Command.execute('ConfirmPrompt.prompt', 'Replace all?', 'Replace All')
    if (!shouldReplace) {
      return
    }
    const { files, ranges } = GetBulkReplacementEdits.getBulkReplacementEdits(items)
    await Command.execute('BulkReplacement.applyBulkReplacement', files, ranges, replacement)
  } catch (error) {
    throw new VError(error, `Failed to replace all`)
  }
}
