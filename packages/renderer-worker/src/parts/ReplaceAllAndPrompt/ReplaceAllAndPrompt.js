import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as TextSearchReplaceAll from '../TextSearchReplaceAll/TextSearchReplaceAll.js'
import * as ViewletSearchStrings from '../ViewletSearch/ViewletSearchStrings.js'

const getConfirmText = (matchCount, fileCount, replacement) => {
  if (matchCount === 1) {
    return ViewletSearchStrings.confirmReplaceOneOccurrenceInOneFile(replacement)
  }
  if (fileCount === 1) {
    return ViewletSearchStrings.confirmReplaceManyOccurrencesInOneFile(matchCount, replacement)
  }
  return ViewletSearchStrings.confirmReplaceManyOccurrencesInManyFiles(matchCount, fileCount, replacement)
}

export const replaceAllAndPrompt = async (items, replacement, matchCount, fileCount) => {
  Assert.array(items)
  Assert.string(replacement)
  Assert.number(matchCount)
  Assert.number(fileCount)
  const confirmTitle = ViewletSearchStrings.replaceAll()
  const confirmAccept = ViewletSearchStrings.replace()
  const confirmText = getConfirmText(matchCount, fileCount, replacement)
  const shouldReplace = await Command.execute('ConfirmPrompt.prompt', confirmText, { title: confirmTitle, confirmMessage: confirmAccept })
  if (!shouldReplace) {
    return false
  }
  await TextSearchReplaceAll.replaceAll(items, replacement)
  return true
}
