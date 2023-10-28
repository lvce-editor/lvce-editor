import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'

export const getTextSearchResultCounts = (results) => {
  let resultCount = 0
  let fileCount = 0
  for (const result of results) {
    switch (result.type) {
      case TextSearchResultType.File:
        fileCount++
        break
      case TextSearchResultType.Match:
        resultCount++
        break
      default:
        break
    }
  }
  return { fileCount, resultCount }
}
