import * as ViewletFindWidgetStrings from '../ViewletFindWidget/ViewletFindWidgetStrings.js'

export const getMatchCountText = (matchIndex, matchCount) => {
  if (matchCount === 0) {
    return ViewletFindWidgetStrings.noResults()
  }
  return ViewletFindWidgetStrings.matchOf(matchIndex + 1, matchCount)
}
