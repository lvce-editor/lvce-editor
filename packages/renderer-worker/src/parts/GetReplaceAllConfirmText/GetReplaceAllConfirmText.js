import * as ViewletSearchStrings from '../ViewletSearch/ViewletSearchStrings.ts'

export const getReplaceAllConfirmText = (matchCount, fileCount, replacement) => {
  if (matchCount === 1) {
    if (replacement) {
      return ViewletSearchStrings.confirmReplaceOneOccurrenceInOneFile(replacement)
    }
    return ViewletSearchStrings.confirmReplaceOneOccurrenceInOneFileNoValue()
  }
  if (fileCount === 1) {
    if (replacement) {
      return ViewletSearchStrings.confirmReplaceManyOccurrencesInOneFile(matchCount, replacement)
    }
    return ViewletSearchStrings.confirmReplaceManyOccurrencesInOneFileNoValue(matchCount)
  }
  if (replacement) {
    return ViewletSearchStrings.confirmReplaceManyOccurrencesInManyFiles(matchCount, fileCount, replacement)
  }
  return ViewletSearchStrings.confirmReplaceManyOccurrencesInManyFilesNoValue(matchCount, fileCount)
}
