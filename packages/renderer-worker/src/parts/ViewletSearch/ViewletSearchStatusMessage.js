import * as Assert from '../Assert/Assert.ts'
import * as ViewletSearchStrings from './ViewletSearchStrings.js'

export const getStatusMessage = (resultCount, fileResultCount) => {
  Assert.number(resultCount)
  Assert.number(fileResultCount)
  if (resultCount === 0) {
    return ViewletSearchStrings.noResults()
  }
  if (resultCount === 1) {
    return ViewletSearchStrings.oneResult()
  }
  if (fileResultCount === 1) {
    return ViewletSearchStrings.manyResultsInOneFile(resultCount)
  }
  return ViewletSearchStrings.manyResultsInManyFiles(resultCount, fileResultCount)
}
