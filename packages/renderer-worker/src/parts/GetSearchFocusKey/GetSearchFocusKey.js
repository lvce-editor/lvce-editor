import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getSearchFocusKey = (key) => {
  switch (key) {
    case 'search-value':
      return WhenExpression.FocusSearchInput
    case 'search-replace-value':
      return WhenExpression.FocusSearchReplaceInput
    case 'Match Case':
      return WhenExpression.FocusSearchMatchCase
    case 'Match Whole Word':
      return WhenExpression.FocusSearchWholeWord
    case 'Use Regular Expression':
      return WhenExpression.FocusSearchRegex
    case 'Replace All':
      return WhenExpression.FocusSearchReplaceAll
    case 'Preserve Case':
      return WhenExpression.FocusSearchPreserveCase
    default:
      return WhenExpression.Empty
  }
}
