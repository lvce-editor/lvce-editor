import * as ReplaceAllAndPrompt from '../ReplaceAllAndPrompt/ReplaceAllAndPrompt.js'
import * as ViewletSearchStrings from './ViewletSearchStrings.js'

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
  const replaced = await ReplaceAllAndPrompt.replaceAllAndPrompt(items, replacement, matchCount, fileCount)
  if (!replaced) {
    return state
  }
  const replacedAllMessage = getReplacedAllMessage(matchCount, fileCount, replacement)
  return {
    ...state,
    fileCount: 0,
    matchCount: 0,
    items: [],
    message: replacedAllMessage,
  }
}
