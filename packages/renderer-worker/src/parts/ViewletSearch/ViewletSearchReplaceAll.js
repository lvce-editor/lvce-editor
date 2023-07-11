import * as TextSearchReplaceAll from '../TextSearchReplaceAll/TextSearchReplaceAll.js'
import * as ViewletSearchStrings from './ViewletSearchStrings.js'
import * as Command from '../Command/Command.js'

const getConfirmText = (matchCount, fileCount, replacement) => {
  if (matchCount === 1) {
    return ViewletSearchStrings.confirmReplaceOneOccurrenceInOneFile(replacement)
  }
  if (fileCount === 1) {
    return ViewletSearchStrings.confirmReplaceManyOccurrencesInOneFile(matchCount, replacement)
  }
  return ViewletSearchStrings.confirmReplaceManyOccurrencesInManyFiles(matchCount, fileCount, replacement)
}

const getReplacedAllMessage = (matchCount, fileCount, replacement) => {
  if (matchCount === 1) {
    return ViewletSearchStrings.replacedOneOccurrenceInOneFile(replacement)
  }
  if (fileCount === 1) {
    return ViewletSearchStrings.replacedManyOccurrencesInOneFile(matchCount, replacement)
  }
  return ViewletSearchStrings.replacedManyOccurrencesInManyFiles(matchCount, fileCount, replacement)
}

export const replaceAll = async (state) => {
  const { items, replacement, matchCount, fileCount } = state
  const confirmTitle = ViewletSearchStrings.replaceAll()
  const confirmAccept = ViewletSearchStrings.replace()
  const confirmText = getConfirmText(matchCount, fileCount, replacement)
  const shouldReplace = await Command.execute('ConfirmPrompt.prompt', confirmText, { title: confirmTitle, confirmMessage: confirmAccept })
  if (!shouldReplace) {
    return state
  }
  console.log({ shouldReplace })
  await TextSearchReplaceAll.replaceAll(items, replacement)
  const replacedAllMessage = getReplacedAllMessage()
  return {
    ...state,
    fileCount: 0,
    matchCount: 0,
    items: [],
    message: replacedAllMessage,
  }
}
