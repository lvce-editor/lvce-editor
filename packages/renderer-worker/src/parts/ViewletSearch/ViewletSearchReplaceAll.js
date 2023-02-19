import * as Command from '../Command/Command.js'
import * as GetBulkReplacementEdits from '../GetBulkReplacementEdits/GetBulkReplacementEdits.js'

const actuallyReplaceAll = async (matches, replacement) => {
  const { files, ranges } = GetBulkReplacementEdits.getBulkReplacementEdits(matches)
  console.log({ files, ranges })
  await Command.execute('BulkReplacement.applyBulkReplacement', files, ranges, replacement)
}

export const replaceAll = async (state) => {
  const shouldReplace = await Command.execute('ConfirmPrompt.prompt', 'Replace all?', 'Replace All')
  if (!shouldReplace) {
    return
  }
  const { items, replacement } = state
  console.log({ replacement, items })
  await actuallyReplaceAll(items, replacement)
  return state
}
