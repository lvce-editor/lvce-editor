import * as ViewletSearchStrings from '../ViewletSearch/ViewletSearchStrings.ts'

export const getReplacedAllMessage = (matchCount, fileCount, replacement) => {
  if (matchCount === 1) {
    return ViewletSearchStrings.replacedOneOccurrenceInOneFile(replacement)
  }
  if (fileCount === 1) {
    return ViewletSearchStrings.replacedManyOccurrencesInOneFile(matchCount, replacement)
  }
  return ViewletSearchStrings.replacedManyOccurrencesInManyFiles(matchCount, fileCount, replacement)
}
